from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from .models import Product
from .schemas import ProductCreate, ProductUpdate


def get_products(db: Session, *, category: str | None = None, search: str | None = None, sort: str | None = None, skip: int = 0, limit: int = 50) -> tuple[list[Product], int]:
    query = select(Product)
    count_query = select(func.count()).select_from(Product)
    filters = []
    if category and category != "Tất cả":
        filters.append(Product.category == category)
    if search:
        term = f"%{search.strip()}%"
        filters.append(or_(Product.name.ilike(term), Product.category.ilike(term)))
    if filters:
        query = query.where(*filters)
        count_query = count_query.where(*filters)
    if sort == "sale":
        query = query.order_by(Product.price.asc())
    elif sort == "new":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.id.asc())
    items = list(db.scalars(query.offset(skip).limit(limit)).all())
    total = db.scalar(count_query) or 0
    return items, total


def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return db.get(Product, product_id)


def create_product(db: Session, payload: ProductCreate) -> Product:
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product: Product, payload: ProductUpdate) -> Product:
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product: Product) -> None:
    db.delete(product)
    db.commit()
