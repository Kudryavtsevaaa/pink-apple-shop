"""
Скрипт для инициализации БД с тестовыми данными
"""
from app.database import SessionLocal, engine, Base
from app.models.product import Category, Product

# Создаем таблицы
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Проверяем, есть ли уже данные
    existing_categories = db.query(Category).count()
    
    if existing_categories == 0:
        print("🌱 Добавляем тестовые данные...")
        
        # Создаем категории
        categories = [
            Category(name="Уход за лицом", description="Средства для ухода за лицом"),
            Category(name="Уход за телом", description="Средства для ухода за телом"),
            Category(name="Макияж", description="Косметика для макияжа"),
            Category(name="Волосы", description="Средства для ухода за волосами"),
        ]
        
        for cat in categories:
            db.add(cat)
        db.commit()
        
        # Создаем товары
        products = [
            Product(name="Крем для лица", price=1500.00, category_id=1, stock_quantity=50, 
                   description="Питательный крем для лица с витаминами"),
            Product(name="Маска для лица", price=800.00, category_id=1, stock_quantity=30,
                   description="Увлажняющая маска для лица"),
            Product(name="Молочко для тела", price=1200.00, category_id=2, stock_quantity=40,
                   description="Увлажняющее молочко для тела"),
            Product(name="Помада", price=650.00, category_id=3, stock_quantity=60,
                   description="Яркая помада для губ"),
            Product(name="Тушь для ресниц", price=750.00, category_id=3, stock_quantity=45,
                   description="Удлиняющая тушь для ресниц"),
            Product(name="Шампунь", price=550.00, category_id=4, stock_quantity=55,
                   description="Мягкий шампунь для волос"),
            Product(name="Кондиционер", price=600.00, category_id=4, stock_quantity=50,
                   description="Питательный кондиционер для волос"),
        ]
        
        for prod in products:
            db.add(prod)
        db.commit()
        
        print("✅ Тестовые данные успешно добавлены!")
    else:
        print("✓ БД уже содержит данные, пропускаем инициализацию")
        
finally:
    db.close()
