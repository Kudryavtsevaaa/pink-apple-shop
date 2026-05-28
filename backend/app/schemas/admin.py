# backend/app/schemas/admin.py
from pydantic import BaseModel

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    username: str
    success: bool = True