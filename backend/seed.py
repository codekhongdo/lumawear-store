from sqlalchemy import delete

from app.database import SessionLocal, create_tables
from app.models import Product

PRODUCTS = [
    {"id": 1, "name": "Quần jeans ống rộng Luna", "category": "Quần", "price": 389000, "old_price": 490000, "rating": 4.9, "sold": 1200, "color": "#d6e4f0", "emoji": "👖", "badge": "Bán chạy"},
    {"id": 2, "name": "Áo sơ mi linen thanh lịch", "category": "Áo", "price": 279000, "old_price": 350000, "rating": 4.8, "sold": 860, "color": "#f4d9bd", "emoji": "👚", "badge": "Yêu thích"},
    {"id": 3, "name": "Váy hoa midi mùa hè", "category": "Váy", "price": 459000, "old_price": 590000, "rating": 4.9, "sold": 640, "color": "#f5c7d7", "emoji": "👗", "badge": "Mới"},
    {"id": 4, "name": "Túi đeo vai mini Luna", "category": "Phụ kiện", "price": 329000, "old_price": 420000, "rating": 4.7, "sold": 430, "color": "#d9c5b2", "emoji": "👜", "badge": None},
    {"id": 5, "name": "Mũ bucket cotton basic", "category": "Mũ", "price": 159000, "old_price": 220000, "rating": 4.8, "sold": 920, "color": "#e9dfc8", "emoji": "🧢", "badge": "Giá tốt"},
    {"id": 6, "name": "Quần short kaki năng động", "category": "Quần", "price": 239000, "old_price": 299000, "rating": 4.6, "sold": 350, "color": "#d5d0bd", "emoji": "🩳", "badge": None},
    {"id": 7, "name": "Áo thun cotton Everyday", "category": "Áo", "price": 189000, "old_price": 250000, "rating": 4.9, "sold": 1800, "color": "#d8e8dc", "emoji": "👕", "badge": "Bán chạy"},
    {"id": 8, "name": "Váy denim dáng chữ A", "category": "Váy", "price": 399000, "old_price": 520000, "rating": 4.7, "sold": 290, "color": "#bbd2e4", "emoji": "👗", "badge": None},
]

create_tables()
with SessionLocal() as db:
    db.execute(delete(Product))
    db.add_all([Product(**item) for item in PRODUCTS])
    db.commit()
print(f"Seeded {len(PRODUCTS)} products")
