from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    stock_quantity: int = 0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    stock_quantity: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryResponse] = None
    
    class Config:
        from_attributes = True