import React from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, categoryPath } from '../../domain/catalog'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand-logo">
            <span className="brand-logo__main">LumaWear</span>
            <span className="brand-logo__sub">Editorial Wardrobe</span>
          </Link>
          <p>
            Thời trang tối giản, thanh lịch cho nhịp sống hiện đại. Chú trọng
            chất liệu tự nhiên và phom dáng bền vững theo thời gian.
          </p>
        </div>

        <div className="footer-col">
          <h4>Danh mục</h4>
          <ul>
            {CATEGORIES.slice(1).map((cat) => (
              <li key={cat}>
                <Link to={categoryPath(cat)}>{cat}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li>
              <Link to="/cart">Giỏ hàng &amp; Mã ưu đãi</Link>
            </li>
            <li>
              <Link to="/account">Tra cứu đơn hàng</Link>
            </li>
            <li>Chính sách đổi trả 30 ngày</li>
            <li>Hướng dẫn chọn kích thước</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Liên hệ Studio</h4>
          <ul>
            <li>Hà Nội: 48 Tràng Tiền, Hoàn Kiếm</li>
            <li>Hotline: 1900 6868 (9:00 – 21:00)</li>
            <li>Email: care@lumawear.vn</li>
            <li>Ưu đãi trực tuyến: Mã LUMA10 (-10%)</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 LumaWear Store. All rights reserved.</span>
        <span>Editorial Design System · Made in Vietnam</span>
      </div>
    </footer>
  )
}
