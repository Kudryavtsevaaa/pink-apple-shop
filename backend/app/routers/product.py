from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0, 
    limit: int = 100, 
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    from app.models.order import OrderItem
    db.query(OrderItem).filter(OrderItem.product_id == product_id).delete()
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully", "product_id": product_id}
