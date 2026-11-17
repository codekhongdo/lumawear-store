# Implementation Plan

## Overview

Xây dựng backend FastAPI chạy local, kết nối PostgreSQL, cung cấp API quản lý sản phẩm cho frontend React hiện tại. Phạm vi giai đoạn đầu chỉ gồm dữ liệu sản phẩm bán hàng; không bao gồm tài khoản, đăng nhập, phân quyền, thanh toán hoặc giỏ hàng server-side.

Backend sẽ thay thế dữ liệu sản phẩm hard-code trong `src/data.js` bằng dữ liệu lưu trong PostgreSQL. Frontend tiếp tục quản lý giỏ hàng cục bộ trong giai đoạn đầu.

## Types

Tạo Pydantic schemas trong `D:\web bán hàng\backend\app\schemas.py`: `ProductBase`, `ProductCreate`, `ProductUpdate`, `ProductResponse` và `ProductListResponse`. Dữ liệu gồm tên, category, giá, giá cũ, rating, số lượng đã bán, màu, emoji và badge. Validation đảm bảo tên/category không rỗng, giá và số lượng không âm, rating trong khoảng $0$ đến $5$.

## Files

- Tạo `D:\web bán hàng\backend\app\{__init__.py,main.py,database.py,models.py,schemas.py,crud.py}`.
- Tạo `D:\web bán hàng\backend\app\routers\{__init__.py,products.py}`.
- Tạo `D:\web bán hàng\backend\{seed.py,requirements.txt,.env.example,README.md}`.
- Tạo `D:\web bán hàng\src\api.js` để gọi API bằng `fetch`.
- Sửa `D:\web bán hàng\src\main.jsx` để lấy sản phẩm từ API, có loading/error state và vẫn giữ giỏ hàng localStorage.
- Sửa `D:\web bán hàng\README.md`, `D:\web bán hàng\memory-bank\activeContext.md` và `D:\web bán hàng\memory-bank\progress.md`.

## Functions

- `get_db`, `create_tables` trong `backend/app/database.py`.
- `get_products`, `get_product_by_id`, `create_product`, `update_product`, `delete_product` trong `backend/app/crud.py`.
- Các endpoint `list_products`, `get_product`, `create_product_endpoint`, `update_product_endpoint`, `delete_product_endpoint` trong `backend/app/routers/products.py`.
- `fetchProducts` và `fetchProduct` trong `src/api.js`.

## Classes

Tạo SQLAlchemy model `Product` trong `backend/app/models.py` với các cột `id`, `name`, `category`, `price`, `old_price`, `rating`, `sold`, `color`, `emoji`, `badge`, `created_at`, `updated_at`. Không tạo user/authentication.

## Dependencies

Backend dùng `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `psycopg[binary]`, `pydantic-settings`, `python-dotenv`, `pytest` và `httpx`. Frontend không thêm package.

## Testing

Kiểm tra health check, kết nối PostgreSQL, CRUD, lỗi `404`/`422`, filter category/search/sort/pagination, CORS và Swagger `/docs`. Chạy build frontend bằng `npm.cmd run build`.

## API Contract

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/health` | Kiểm tra backend/database |
| GET | `/api/products` | Danh sách, lọc và phân trang |
| GET | `/api/products/{id}` | Chi tiết sản phẩm |
| POST | `/api/products` | Tạo sản phẩm |
| PATCH | `/api/products/{id}` | Cập nhật sản phẩm |
| DELETE | `/api/products/{id}` | Xóa sản phẩm |

## Implementation Order

1. Tạo cấu trúc backend và requirements.
2. Cấu hình PostgreSQL local, model, session và schemas.
3. Tạo CRUD, router, health check và CORS.
4. Tạo seed script.
5. Kết nối frontend với API và bổ sung loading/error state.
6. Cập nhật README/memory-bank.
7. Chạy kiểm tra backend/frontend và rà soát thay đổi.
