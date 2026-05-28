import json
from pathlib import Path
from datetime import datetime

DATA_FILE = Path(__file__).parent.parent / "data.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    _data = json.load(f)

# Глобальные списки данных
categories = _data.get("categories", [])
products = _data.get("products", [])
admins = _data.get("admins", [])
orders = _data.get("orders", [])
order_items = _data.get("order_items", [])

# === Категории ===
def get_categories():
    return categories

# === Товары ===
def get_products():
    return products

def get_product_by_id(product_id: int):
    return next((p for p in products if p["id"] == product_id), None)

def get_products_by_category(category_id: int):
    return [p for p in products if p["category_id"] == category_id]

# === Админы ===
def get_admin_by_username(username: str):
    return next((a for a in admins if a["username"] == username), None)

# === Заказы ===
def get_orders():
    # Добавляем items к каждому заказу
    result = []
    for order in orders:
        items = [i for i in order_items if i["order_id"] == order["id"]]
        result.append({**order, "items": items})
    return result

def get_order_by_id(order_id: int):
    order = next((o for o in orders if o["id"] == order_id), None)
    if order:
        items = [i for i in order_items if i["order_id"] == order_id]
        return {**order, "items": items}
    return None

def create_order(customer_name: str, phone: str, email: str, address: str, items: list):
    """Создаёт новый заказ в памяти (не сохраняется в файл!)"""
    new_id = max((o["id"] for o in orders), default=0) + 1
    total = sum(item["price"] * item["quantity"] for item in items)
    
    new_order = {
        "id": new_id,
        "customer_name": customer_name,
        "phone": phone,
        "email": email,
        "address": address,
        "total_amount": total,
        "status": "new",
        "created_at": datetime.now().isoformat()
    }
    orders.append(new_order)
    
    for item in items:
        new_item = {
            "id": max((i["id"] for i in order_items), default=0) + 1,
            "order_id": new_id,
            "product_id": item["product_id"],
            "quantity": item["quantity"],
            "price": item["price"]
        }
        order_items.append(new_item)
    
    return new_order