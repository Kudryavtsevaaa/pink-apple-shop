# backend/app/models/product.py
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(500))
    category_id = Column(Integer, ForeignKey("categories.id"))
    stock_quantity = Column(Integer, default=0)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")  # ← Добавили