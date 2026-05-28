# backend/app/schemas/order.py
from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

class ProductInfo(BaseModel):
    """Информация о товаре для отображения в заказе"""
    id: int
    name: str
    
    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: Optional[int] = None
    quantity: int
    price: Decimal

class OrderItemCreate(OrderItemBase):
    product_id: int

class OrderItemResponse(OrderItemBase):
    id: int
    product: Optional[ProductInfo] = None  # ← Добавили информацию о товаре
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    delivery_address: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: int
    total_amount: Decimal
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True