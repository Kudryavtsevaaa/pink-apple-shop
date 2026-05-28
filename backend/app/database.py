import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    _data = json.load(f)

categories = _data.get("categories", [])
products = _data.get("products", [])

def get_categories():
    return categories

def get_products():
    return products

def get_product_by_id(product_id: int):
    return next((p for p in products if p["id"] == product_id), None)

def get_products_by_category(category_id: int):
    return [p for p in products if p["category_id"] == category_id]