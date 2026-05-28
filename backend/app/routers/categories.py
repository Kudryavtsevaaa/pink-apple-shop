from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.product import Category
from app.schemas.product import CategoryCreate, CategoryResponse

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@router.post("/", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category