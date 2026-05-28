from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Получаем URL с fallback по умолчанию
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/apple")

# Проверка на пустой URL
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL не задан! Проверьте файл .env")

print(f"🔗 Подключение к БД: {SQLALCHEMY_DATABASE_URL}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,  # Проверка соединения перед использованием
    pool_recycle=3600    # Переподключение каждые 1 час
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()