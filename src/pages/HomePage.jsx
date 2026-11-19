import React from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/commerce/ProductCard'
import { Button } from '../components/ui'
import { CATEGORY_META, categoryPath } from '../domain/catalog'
import { useUI } from '../state/UIContext'

export function HomePage({ products }) {
  const { showToast } = useUI()
  const featured = products.slice(0, 8)
  const newArrivals = products
    .filter((p) => p.isNew || p.badge === 'Mới')
    .slice(0, 4)

  const copyCoupon = () => {
    navigator.clipboard?.writeText('LUMA10').catch(() => {})
    showToast('Đã sao chép mã giảm giá LUMA10 (-10%)')
  }

  return (
    <>
      <section className="hero-editorial">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Bộ sưu tập Thu — Đông 2026</p>
            <h1 className="hero-title">
              Thanh lịch <em>tối giản</em> cho từng khoảnh khắc.
            </h1>
            <p className="hero-desc">
              LumaWear tôn vinh phom dáng chuẩn mực, chất liệu tự nhiên như linen
              Bỉ, lụa Tencel và cotton hữu cơ — dễ phối, bền dáng và vượt thời gian.
            </p>
            <div className="hero-cta-group">
              <Button to="/products">Khám phá bộ sưu tập</Button>
              <Button to="/products?sort=new" variant="outline">
                Hàng mới về
              </Button>
            </div>
            <div className="hero-stats">
              <div>
                <strong>100%</strong>
                <span>Chất liệu tự nhiên tuyển chọn</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Đánh giá từ khách hàng</span>
              </div>
              <div>
                <strong>30 ngày</strong>
                <span>Đổi trả linh hoạt tại nhà</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
                alt="LumaWear Editorial Lookbook"
              />
            </div>
            <div className="hero-caption-card">
              <span>Signature Edit</span>
              <strong>Atelier Linen &amp; Tailoring</strong>
              <p>Phom suông tinh tế cho ngày làm việc và cuối tuần.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars-strip">
        <div className="pillars-grid">
          <div className="pillar-item">
            <div className="pillar-icon">✦</div>
            <div>
              <strong>Miễn phí vận chuyển</strong>
              <span>Cho mọi đơn hàng từ 1.000.000₫</span>
            </div>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon">↺</div>
            <div>
              <strong>Đổi size trong 30 ngày</strong>
              <span>Hỗ trợ đổi trả nhanh gọn tận nơi</span>
            </div>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon">◇</div>
            <div>
              <strong>Ưu đãi thành viên</strong>
              <span>Nhập mã LUMA10 giảm ngay 10%</span>
            </div>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon">✓</div>
            <div>
              <strong>Thanh toán linh hoạt</strong>
              <span>Hỗ trợ COD và chuyển khoản VietQR</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Danh mục tuyển chọn</p>
              <h2 className="section-title">Mua sắm theo phong cách</h2>
            </div>
            <Link to="/products" className="section-link">
              Xem tất cả
            </Link>
          </div>

          <div className="category-grid">
            {CATEGORY_META.map((cat) => (
              <Link
                key={cat.name}
                to={categoryPath(cat.name)}
                className="category-card"
              >
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="category-card__body">
                  <h3>{cat.name}</h3>
                  <span>{cat.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Được yêu thích nhất</p>
              <h2 className="section-title">Thiết kế nổi bật</h2>
            </div>
            <Link to="/products" className="section-link">
              Xem bộ sưu tập
            </Link>
          </div>

          <div className="product-grid">
            {featured.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-banner">
        <div className="editorial-banner__grid">
          <div className="editorial-banner__copy">
            <p className="eyebrow">Ưu đãi đặc quyền trực tuyến</p>
            <h2>Hoàn thiện tủ đồ tối giản của riêng bạn</h2>
            <p>
              Áp dụng mã ưu đãi trực tiếp trong giỏ hàng trượt và nhận miễn phí
              vận chuyển toàn quốc cho đơn từ 1.000.000₫.
            </p>
            <div className="coupon-pill">
              <span>Mã ưu đãi 10%:</span>
              <strong>LUMA10</strong>
              <Button variant="inverse" size="sm" onClick={copyCoupon}>
                Sao chép
              </Button>
            </div>
            <div>
              <Button to="/products" variant="inverse">
                Mua sắm ngay
              </Button>
            </div>
          </div>
          <div className="editorial-banner__media">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85"
              alt="LumaWear Campaign"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">Mới ra mắt</p>
                <h2 className="section-title">Ấn phẩm mùa mới</h2>
              </div>
              <Link to="/products?sort=new" className="section-link">
                Xem hàng mới
              </Link>
            </div>
            <div className="product-grid">
              {newArrivals.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
