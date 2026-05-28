# backend/app/routers/orders.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse, OrderItemCreate

router = APIRouter()

@router.get("/", response_model=List[OrderResponse])
async def get_orders(db: Session = Depends(get_db)):
    # Подгружаем items с product
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    # Подгружаем items с product
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # Проверяем наличие товаров
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404, 
                detail=f"Товар с ID {item.product_id} не найден"
            )
        
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Недостаточно товара '{product.name}' на складе. "
                       f"Доступно: {product.stock_quantity}, запрошено: {item.quantity}"
            )
    
    # Создаем заказ
    total_amount = sum(item.price * item.quantity for item in order.items)
    
    db_order = Order(
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        customer_email=order.customer_email,
        delivery_address=order.delivery_address,
        total_amount=total_amount,
        status='new'
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Создаем items
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
        
        # Уменьшаем остаток
        product = db.query(Product).filter(Product.id == item.product_id).first()
        product.stock_quantity -= item.quantity
    
    db.commit()
    
    # Возвращаем заказ с товарами
    db.refresh(db_order)
    order_with_items = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product)
    ).filter(Order.id == db_order.id).first()
    
    return order_with_items

@router.put("/{order_id}/status")
async def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    return {"message": "Order status updated", "status": status}