# Active context
Đã hoàn thành frontend MVP thương hiệu LumaWear, màu cam san hô #FF6B4A, desktop-first. Các luồng sản phẩm, tìm kiếm/lọc, chi tiết, giỏ hàng, checkout COD mô phỏng, tài khoản và đơn hàng giả lập đã hoạt động. Bước tiếp theo nếu cần: tách component nhỏ hơn, bổ sung ảnh sản phẩm thật và backend.
- Đã tinh chỉnh UI header: tăng chiều cao header/menu, tăng cỡ chữ và khoảng cách menu, cân bằng cụm Tài khoản/giỏ hàng bằng SVG inline.
- Đã sửa lỗi UI chữ tiếng Việt bị giãn và menu trên cùng quá nhỏ tại `src/styles.css`: chuẩn hóa spacing/text-align, giới hạn chiều rộng tiêu đề và tăng kích thước menu theo breakpoint.
- Đã sửa lỗi font tiếng Việt tại banner chính bằng cách tải `Be Vietnam Pro` từ Google Fonts trong `index.html` và áp dụng thống nhất cho toàn bộ typography trong `src/styles.css`.
- Đã kiểm tra desktop tại `http://127.0.0.1:5174/`; responsive có breakpoint cho tablet/mobile.
