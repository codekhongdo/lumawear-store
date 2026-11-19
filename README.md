# LumaWear Store — Design System & Design Patterns Edition

Website thương mại điện tử thời trang **LumaWear Store** (React + Vite + FastAPI) được tái cấu trúc toàn diện theo **Design System** chuẩn hóa bằng CSS Tokens + UI Primitives và các **Design Patterns** phổ biến trong kỹ thuật phần mềm Frontend.

## Kiến trúc Design System

- **`src/styles/tokens.css`**: Hệ thống Design Tokens phân tầng (Primitive → Semantic) cho bảng màu Editorial (`#FFFFFF`, `#F8F7F4`, `#111111`, `#B89B72`, `#9A7B56`), typography (*Cormorant Garamond* + *Be Vietnam Pro*), thang spacing, bán kính bo góc, z-index và motion.
- **`src/styles/base.css`**: Reset chuẩn hóa, hỗ trợ keyboard focus (`:focus-visible`) và `prefers-reduced-motion`.
- **`src/styles/primitives.css` & `src/components/ui/`**: Thư viện UI Primitives tái sử dụng (`Button`, `IconButton`, `Badge`, `Field`, `Drawer`, `Modal`, `EmptyState`, `PriceDisplay`, `QuantityStepper`, `SwatchPicker`, `ToastViewport`, `Icons`).

## Các Design Patterns áp dụng

| Pattern | Vị trí | Vai trò |
| --- | --- | --- |
| **Repository + Adapter Pattern** | `src/services/productRepository.js`, `src/services/storageService.js` | Tách biệt tầng lấy dữ liệu API (FastAPI) khỏi UI, chuyển đổi DTO `snake_case` → Domain Model và tự động fallback sang bộ dữ liệu local khi deploy tĩnh. |
| **Strategy Pattern** | `src/domain/pricingStrategy.js`, `src/domain/productFilters.js` | Đóng gói thuật toán tính mã giảm giá (`LUMA10`), miễn phí vận chuyển (`1.000.000₫`) và sắp xếp/lọc sản phẩm. |
| **Factory Pattern** | `src/domain/orderFactory.js` | Chuẩn hóa việc khởi tạo đơn hàng và sinh mã đơn `#LW-2026-XXXX`. |
| **Flux / Reducer + Provider Composition** | `src/state/CartContext.jsx`, `WishlistContext.jsx`, `OrderContext.jsx`, `UIContext.jsx`, `StoreProvider.jsx` | Tách biệt trạng thái theo từng miền nghiệp vụ, quản lý giỏ hàng bằng `useReducer` để tránh re-render không cần thiết. |
| **Custom Hooks Pattern** | `src/hooks/useProducts.js`, `src/hooks/useEscapeKey.js` | Tái sử dụng logic bất đồng bộ và hành vi truy cập bàn phím (đóng Drawer/Modal bằng phím `Esc`). |

## Cài đặt và chạy local

```bash
npm install
npm run dev
```

Build production (tương thích sẵn GitHub Pages qua `.github/workflows/deploy.yml`):

```bash
npm run build
npm run preview
```
