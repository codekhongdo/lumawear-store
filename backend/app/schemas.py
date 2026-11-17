from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

CATEGORIES = {"Quần", "Áo", "Váy", "Phụ kiện", "Mũ"}


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=40)
    price: int = Field(ge=0)
    old_price: int | None = Field(default=None, ge=0)
    rating: float = Field(default=0, ge=0, le=5)
    sold: int = Field(default=0, ge=0)
    color: str = Field(default="#f2eee9", max_length=20)
    emoji: str = Field(default="🛍️", max_length=20)
    badge: str | None = Field(default=None, max_length=40)

    @field_validator("name", "category")
    @classmethod
    def strip_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Giá trị không được để trống")
        return value

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        if value not in CATEGORIES:
            raise ValueError(f"Category phải là một trong: {', '.join(sorted(CATEGORIES))}")
        return value


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=160)
    category: str | None = Field(default=None, min_length=1, max_length=40)
    price: int | None = Field(default=None, ge=0)
    old_price: int | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0, le=5)
    sold: int | None = Field(default=None, ge=0)
    color: str | None = Field(default=None, max_length=20)
    emoji: str | None = Field(default=None, max_length=20)
    badge: str | None = Field(default=None, max_length=40)


class ProductResponse(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
