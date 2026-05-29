from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminLogin, AdminResponse

router = APIRouter()

@router.post("/login")
async def admin_login(login: AdminLogin, db: Session = Depends(get_db)):
    """
    Простая проверка логина и пароля.
    
    Демо-доступ:
    - username: `admin`
    - password: `admin123`
    """
    admin = db.query(Admin).filter(Admin.username == login.username).first()
    
    # Простая проверка (в продакшене используйте хэши!)
    if not admin or admin.password_hash != login.password:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    return {"success": True, "username": admin.username}

@router.get("/me")
async def get_admin_info():
    """Заглушка - возвращает, что админ авторизован"""
    return {"authenticated": True}