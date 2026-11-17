# LumaWear API

Backend FastAPI local cho sản phẩm LumaWear, dùng PostgreSQL.

## Chuẩn bị PostgreSQL

Tạo database:

```sql
CREATE DATABASE lumawear;
```

Sao chép `backend/.env.example` thành `backend/.env` và cập nhật thông tin kết nối nếu cần.

## Cài đặt và chạy

Từ thư mục `D:\web bán hàng`:

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
backend\.venv\Scripts\python.exe backend\seed.py
backend\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir backend --reload --port 8000
```

API docs: `http://127.0.0.1:8000/docs`  
Health check: `http://127.0.0.1:8000/health`

Frontend dùng `VITE_API_URL=http://127.0.0.1:8000/api` mặc định.
