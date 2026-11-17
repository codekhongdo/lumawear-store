import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import create_tables
from .routers.products import router as products_router

app = FastAPI(title="LumaWear API", version="1.0.0")

origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(products_router, prefix="/api")


@app.on_event("startup")
def startup() -> None:
    create_tables()


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "LumaWear API is running", "docs": "/docs", "products": "/api/products"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
