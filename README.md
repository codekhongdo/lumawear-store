# LumaWear Store

Website bán thời trang frontend-only được xây dựng với React và Vite. LumaWear cung cấp trải nghiệm mua sắm hiện đại với các danh mục quần áo, váy, phụ kiện và mũ.

## Demo trực tuyến

**Website:** [https://codekhongdo.github.io/lumawear-store/](https://codekhongdo.github.io/lumawear-store/)

## Tính năng

- Trang chủ với banner, danh mục và sản phẩm nổi bật.
- Danh sách sản phẩm.
- Tìm kiếm và lọc sản phẩm theo danh mục.
- Sắp xếp sản phẩm mới và sản phẩm khuyến mãi.
- Trang chi tiết sản phẩm.
- Thêm, tăng, giảm và xóa sản phẩm trong giỏ hàng.
- Lưu giỏ hàng bằng `localStorage`.
- Checkout mô phỏng với phương thức thanh toán khi nhận hàng (COD).
- Trang tài khoản và lịch sử đơn hàng mô phỏng.
- Giao diện responsive cho desktop, tablet và mobile.
- Deploy tự động lên GitHub Pages bằng GitHub Actions.

## Công nghệ sử dụng

- [React](https://react.dev/) — xây dựng giao diện component-based.
- [Vite](https://vite.dev/) — công cụ phát triển và build frontend.
- [React Router](https://reactrouter.com/) — điều hướng giữa các trang.
- React Context API — quản lý giỏ hàng.
- CSS thuần — thiết kế giao diện và responsive.
- `localStorage` — lưu dữ liệu giỏ hàng và đơn hàng mô phỏng.

## Yêu cầu môi trường

- Node.js 20 trở lên.
- npm đi kèm Node.js.

Kiểm tra phiên bản đã cài:

```bash
node --version
npm --version
```

## Cài đặt và chạy local

Clone repository:

```bash
git clone https://github.com/codekhongdo/lumawear-store.git
cd lumawear-store
```

Cài đặt dependency:

```bash
npm install
```

Khởi động development server:

```bash
npm run dev
```

Mở URL được hiển thị trong terminal, thường là:

```text
http://localhost:5173/
```

## Các lệnh npm

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy development server với Vite |
| `npm run build` | Build phiên bản production vào thư mục `dist/` |
| `npm run preview` | Chạy thử bản build production local |

Build và preview production:

```bash
npm run build
npm run preview
```

## Cấu trúc dự án

```text
lumawear-store/
├── .github/
│   └── workflows/
│       └── deploy.yml       # Workflow build và deploy GitHub Pages
├── src/
│   ├── data.js              # Dữ liệu danh mục và sản phẩm
│   ├── main.jsx             # Component, router và entry point
│   └── styles.css           # CSS giao diện và responsive
├── index.html               # HTML entry point
├── package.json             # Scripts và dependencies
├── package-lock.json        # Khóa phiên bản dependency
├── vite.config.js           # Cấu hình Vite và base path
└── README.md                # Tài liệu dự án
```

## Deploy lên GitHub Pages

Dự án sử dụng workflow tại `.github/workflows/deploy.yml`.

Mỗi lần push lên branch `main`, GitHub Actions sẽ:

1. Checkout source code.
2. Cài Node.js và dependencies.
3. Chạy `npm run build`.
4. Upload thư mục `dist/`.
5. Deploy artifact lên GitHub Pages.

Vite được cấu hình base path cho repository:

```javascript
base: '/lumawear-store/'
```

Để bật Pages trong repository, vào **Settings → Pages → Source** và chọn **GitHub Actions**.

## Lưu ý

- Đây là frontend demo, chưa có backend hoặc cơ sở dữ liệu.
- Checkout chỉ mô phỏng đơn hàng COD, không xử lý thanh toán thật.
- Dữ liệu giỏ hàng và đơn hàng được lưu trong trình duyệt hiện tại.
- Khi deploy dưới subpath GitHub Pages, không xóa cấu hình `base` trong `vite.config.js`.

## License

Dự án phục vụ mục đích học tập và demo frontend.