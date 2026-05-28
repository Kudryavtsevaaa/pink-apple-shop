# backend/app/core/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

# === НАСТРОЙКИ ===
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 часа

# === ХЭШИРОВАНИЕ ПАРОЛЕЙ ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет, совпадает ли пароль с хэшем"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Создаёт хэш из пароля"""
    return pwd_context.hash(password)

# === РАБОТА С JWT ТОКЕНАМИ ===
def create_access_token( dict, expires_delta: Optional[timedelta] = None) -> str:
    """Создаёт JWT токен"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Расшифровывает JWT токен"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )

# === ПРОВЕРКА АВТОРИЗАЦИИ ===
async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Проверяет токен и возвращает данные админа.
    Используйте как зависимость в защищённых эндпоинтах.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Токен не предоставлен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_token(token)
    
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверные учетные данные",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"username": username}