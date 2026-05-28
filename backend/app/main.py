from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers.product import router as products_router
from app.routers.order import router as orders_router
from app.routers.categories import router as categories_router
from app.routers.admin import router as admin_router
from app.database import engine, Base

print("🚀 Инициализация приложения...")

# Создаем таблицы (с проверкой)
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Таблицы БД созданы/проверены")
except Exception as e:
    print(f"⚠️ Ошибка при создании таблиц: {e}")

app = FastAPI(
    title="Розовое яблоко - API",
    description="API для магазина косметики",
    version="1.0.0"
)

# Настраиваем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,  # ← используем property
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(categories_router, prefix="/api/categories", tags=["Categories"])
app.include_router(products_router, prefix="/api/products", tags=["Products"])
app.include_router(orders_router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API магазина Розовое яблоко!"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "database": "connected"}

print("✅ Приложение готово к работе!")