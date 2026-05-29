from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminLogin

router = APIRouter()


@router.post("/login")
async def admin_login(login: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == login.username).first()

    if not admin or admin.password_hash != login.password:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    return {"success": True, "username": admin.username}


@router.get("/me")
async def get_admin_info():
    return {"authenticated": True}
