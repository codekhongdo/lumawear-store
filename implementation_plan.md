# Implementation Plan

## Overview
Sửa toàn bộ luồng lọc sản phẩm theo danh mục tại trang `/products` để URL, state, danh sách hiển thị, active tab và tiêu đề luôn đồng bộ. Phạm vi giữ nguyên React Router và dạng query `category=<tên danh mục>` trong URL hash; giá trị tiếng Việt được mã hóa khi tạo URL và giải mã an toàn khi đọc.

## Types

Không sử dụng TypeScript nên không có thay đổi type/interface. Danh mục hợp lệ tiếp tục lấy từ `categories` trong `D:\web bán hàng\src\data.js`. Giá trị lọc chuẩn là một trong các danh mục đó, với `Tất cả` là trạng thái không lọc.

## Files

- `D:\web bán hàng\src\main.jsx`: thêm helper tạo đường dẫn danh mục; đổi các liên kết danh mục sang query được mã hóa; sửa component `Products` để đọc `location.search`, giải mã và xác thực danh mục, đồng bộ kết quả theo URL, dùng `Link` cho tab, active class và tiêu đề động.
- `D:\web bán hàng\src\styles.css`: bổ sung style cho tab lọc đang chọn và trạng thái hover/focus.
- `D:\web bán hàng\implementation_plan.md`: tài liệu kế hoạch triển khai này.
- `D:\web bán hàng\memory-bank\activeContext.md`: ghi nhận thay đổi và lịch sử sửa lỗi.
- `D:\web bán hàng\memory-bank\progress.md`: ghi nhận task đã hoàn tất và nhiệm vụ phát sinh nếu có.

## Functions

- Thêm `categoryPath(category)` trong `D:\web bán hàng\src\main.jsx`: trả về `/products` cho `Tất cả`, hoặc `/products?category=` + `encodeURIComponent(category)` cho danh mục cụ thể.
- Sửa `Products()` trong `D:\web bán hàng\src\main.jsx`: đọc `useLocation().search` ở mỗi lần URL thay đổi; dùng `decodeURIComponent` có bắt lỗi; chỉ chấp nhận danh mục hợp lệ; lọc sản phẩm theo danh mục và query; render tab bằng `Link`, active class và H1 động.
- Cập nhật các nơi tạo liên kết danh mục trong `Header()` và `Home()` để dùng cùng helper.

## Classes

Không có class JavaScript nào được thêm hoặc sửa.

## Dependencies

Không thêm hoặc nâng cấp dependency. Tiếp tục dùng React, React Router DOM và Vite hiện có.

## Testing

- Chạy `npm.cmd run build` để kiểm tra compile production.
- Kiểm tra thủ công các URL `#/products`, `#/products?category=Qu%E1%BA%A7n`, `#/products?category=Ph%E1%BB%A5%20ki%E1%BB%87n`.
- Xác nhận click từng tab cập nhật hash, danh sách và active state; Back/Forward cập nhật lại giao diện; danh mục không hợp lệ fallback về `Tất cả sản phẩm`.

## Implementation Order

1. Chuẩn hóa helper URL danh mục và các liên kết điều hướng.
2. Đồng bộ component `Products` với query URL, giải mã và xác thực danh mục.
3. Thêm style active/hover/focus cho các tab.
4. Cập nhật memory-bank.
5. Chạy build và rà soát thay đổi.
