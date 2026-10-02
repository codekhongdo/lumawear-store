# Progress
- [x] Chốt phạm vi MVP và thương hiệu
- [x] Tạo cấu hình Vite/React tối thiểu
- [x] Hoàn thiện giao diện và luồng mua hàng
- [x] Chạy build và kiểm tra cuối
- [x] Xử lý lỗi PowerShell chặn npm.ps1 bằng npm.cmd
- [x] Cài dependency thành công, không phát hiện vulnerability

- [x] Tinh chỉnh khoảng cách chữ logo và cân bằng cụm Tài khoản/giỏ hàng trong header
- Lịch sử Fix Lỗi: Đã sửa lỗi chữ/nhãn header bị giãn và Tài khoản nhỏ hơn icon tại `src/styles.css` bằng các rule tinh chỉnh cuối file.
- [x] Tăng kích thước header/menu, chuẩn hóa chữ và thay icon header bằng SVG
- [x] Kiểm tra desktop, mobile responsive và build production thành công
- Lịch sử Fix Lỗi: Đã sửa menu/header quá nhỏ tại `src/styles.css` và icon Unicode lệch tỷ lệ tại `src/main.jsx` bằng cách tăng kích thước, bổ sung breakpoint responsive và dùng SVG inline.
- [x] Sửa lỗi UI chữ tiếng Việt bị giãn và menu trên cùng quá nhỏ tại `src/styles.css` bằng cách chuẩn hóa spacing/text-align, giới hạn tiêu đề và tăng kích thước menu theo breakpoint.
- [x] Lịch sử Fix Lỗi: Đã sửa lỗi font tiếng Việt bị tách dấu tại banner chính bằng cách thêm Google Fonts `Be Vietnam Pro` vào `index.html` và thay các fallback `Georgia`/`Inter` trong `src/styles.css`.

## Nhiệm vụ tiếp theo / Việc cần làm (Future Tasks)
- Bổ sung kiểm thử E2E nếu dự án cần tự động hóa kiểm tra giao diện.