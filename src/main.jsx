import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  HashRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  COUPONS,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  categories,
  categoryMeta,
  formatPrice,
  normalizeProduct,
  products as localProducts,
} from './data'
import { fetchProducts } from './api'
import './styles.css'

const categoryPath = (category) =>
  category === 'Tất cả' ? '/products' : `/products?category=${encodeURIComponent(category)}`

const StoreContext = createContext(null)
const useStore = () => useContext(StoreContext)

function safeReadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => safeReadStorage('lumawear-cart', []))
  const [wishlist, setWishlist] = useState(() => safeReadStorage('lumawear-wishlist', []))
  const [orders, setOrders] = useState(() => {
    const saved = safeReadStorage('lumawear-orders', null)
    if (Array.isArray(saved)) return saved
    const legacy = safeReadStorage('lumawear-last-order', null)
    return legacy
      ? [{ code: 'LW-2026-0001', ...legacy, items: [], paymentMethod: 'COD' }]
      : []
  })
  const [couponCode, setCouponCode] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    localStorage.setItem('lumawear-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('lumawear-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem('lumawear-orders', JSON.stringify(orders))
  }, [orders])

  const showToast = (message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  const addToCart = (product, options = {}) => {
    const selectedColor = options.color || product.swatches?.[0]?.name || 'Mặc định'
    const selectedSize = options.size || product.sizes?.[0] || 'M'
    const qtyToAdd = options.qty || 1
    const variantKey = `${product.id}__${selectedColor}__${selectedSize}`

    setCart((prev) => {
      const existing = prev.find((item) => item.variantKey === variantKey)
      if (existing) {
        return prev.map((item) =>
          item.variantKey === variantKey
            ? { ...item, qty: item.qty + qtyToAdd }
            : item
        )
      }
      return [
        ...prev,
        {
          variantKey,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color: selectedColor,
          size: selectedSize,
          qty: qtyToAdd,
        },
      ]
    })
    showToast(`Đã thêm "${product.name}" (${selectedSize}) vào giỏ hàng`)
    if (options.openDrawer !== false) {
      setCartOpen(true)
    }
  }

  const updateCartQty = (variantKey, nextQty) => {
    setCart((prev) =>
      nextQty < 1
        ? prev.filter((item) => item.variantKey !== variantKey)
        : prev.map((item) =>
            item.variantKey === variantKey ? { ...item, qty: nextQty } : item
          )
    )
  }

  const removeFromCart = (variantKey) => {
    setCart((prev) => prev.filter((item) => item.variantKey !== variantKey))
  }

  const clearCart = () => {
    setCart([])
    setCouponCode('')
  }

  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id)
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id))
      showToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích`)
    } else {
      setWishlist((prev) => [product, ...prev])
      showToast(`Đã lưu "${product.name}" vào danh sách yêu thích`)
    }
  }

  const isWishlisted = (id) => wishlist.some((item) => item.id === id)

  const applyCoupon = (rawCode) => {
    const normalized = (rawCode || '').trim().toUpperCase()
    if (!normalized) {
      showToast('Vui lòng nhập mã giảm giá')
      return false
    }
    if (COUPONS[normalized]) {
      setCouponCode(normalized)
      showToast(`Đã áp dụng mã ${normalized} (-10%)`)
      return true
    }
    showToast('Mã giảm giá không hợp lệ. Thử mã LUMA10')
    return false
  }

  const removeCoupon = () => {
    setCouponCode('')
    showToast('Đã gỡ mã giảm giá')
  }

  const createOrder = (orderPayload) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const newOrder = {
      code: `LW-2026-${randomNum}`,
      date: new Date().toLocaleDateString('vi-VN'),
      status:
        orderPayload.paymentMethod === 'QR'
          ? 'Chờ xác nhận chuyển khoản'
          : 'Đang chuẩn bị hàng',
      ...orderPayload,
    }
    setOrders((prev) => [newOrder, ...prev])
    localStorage.setItem('lumawear-last-order', JSON.stringify(newOrder))
    clearCart()
    showToast(`Đặt hàng thành công! Mã đơn ${newOrder.code}`)
    return newOrder
  }

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  )
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  )
  const activeCoupon = couponCode ? COUPONS[couponCode] : null
  const discount = activeCoupon ? Math.round(subtotal * activeCoupon.rate) : 0
  const afterDiscount = Math.max(0, subtotal - discount)
  const shipping =
    subtotal === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const grandTotal = afterDiscount + shipping
  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount)
  const freeShipProgress = Math.min(
    100,
    Math.round((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100)
  )

  const value = {
    cart,
    wishlist,
    orders,
    couponCode,
    activeCoupon,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    quickViewProduct,
    setQuickViewProduct,
    toasts,
    showToast,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    applyCoupon,
    removeCoupon,
    createOrder,
    subtotal,
    discount,
    shipping,
    grandTotal,
    cartCount,
    freeShipRemaining,
    freeShipProgress,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function FreeShippingBar() {
  const { freeShipRemaining, freeShipProgress, subtotal } = useStore()
  if (subtotal === 0) return null

  return (
    <div className="freeship-box">
      {freeShipRemaining > 0 ? (
        <span>
          Mua thêm <strong>{formatPrice(freeShipRemaining)}</strong> để được{' '}
          <strong>Miễn phí vận chuyển</strong>
        </span>
      ) : (
        <span>
          Đơn hàng của bạn đã đủ điều kiện <strong>Miễn phí vận chuyển</strong>
        </span>
      )}
      <div className="freeship-track">
        <div
          className={`freeship-fill${freeShipRemaining === 0 ? ' done' : ''}`}
          style={{ width: `${freeShipProgress}%` }}
        />
      </div>
    </div>
  )
}

function CouponBox() {
  const { couponCode, activeCoupon, applyCoupon, removeCoupon } = useStore()
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (applyCoupon(input)) {
      setInput('')
    }
  }

  if (activeCoupon) {
    return (
      <div className="coupon-applied">
        <span>
          Đã áp dụng <strong>{couponCode}</strong> ({activeCoupon.label})
        </span>
        <button type="button" onClick={removeCoupon}>
          Gỡ
        </button>
      </div>
    )
  }

  return (
    <form className="coupon-form" onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập mã giảm giá (VD: LUMA10)"
        aria-label="Mã giảm giá"
      />
      <button type="submit" className="btn btn-outline btn-sm">
        Áp dụng
      </button>
    </form>
  )
}

function Header() {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="announcement-bar">
        Miễn phí vận chuyển cho đơn từ <strong>1.000.000₫</strong> &nbsp;•&nbsp; Nhập mã{' '}
        <strong>LUMA10</strong> giảm ngay 10%
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button
            type="button"
            className="icon-btn mobile-menu-btn"
            aria-label="Mở menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <Link to="/" className="brand-logo" aria-label="LumaWear Store">
            <span className="brand-logo-main">LumaWear</span>
            <span className="brand-logo-sub">Editorial Wardrobe</span>
          </Link>

          <nav className="main-nav" aria-label="Điều hướng chính">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Trang chủ
            </Link>
            <Link
              to="/products"
              className={
                location.pathname === '/products' && !location.search ? 'active' : ''
              }
            >
              Bộ sưu tập
            </Link>
            {categories.slice(1).map((cat) => (
              <Link key={cat} to={categoryPath(cat)}>
                {cat}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm thiết kế..."
                aria-label="Tìm kiếm sản phẩm"
              />
              <button type="submit" aria-label="Tìm kiếm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </form>

            <button
              type="button"
              className="icon-btn"
              aria-label="Danh sách yêu thích"
              onClick={() => setWishlistOpen(true)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 20.4s-7-4.5-9.2-8.4C1.2 9.1 2.7 5.5 6.2 5.1c2-.2 3.7.8 4.8 2.3 1.1-1.5 2.8-2.5 4.8-2.3 3.5.4 5 4 3.4 6.9-2.2 3.9-9.2 8.4-9.2 8.4Z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="icon-badge accent">{wishlist.length}</span>
              )}
            </button>

            <Link to="/account" className="icon-btn" aria-label="Tài khoản">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.6" />
                <path d="M5 20c.8-3.8 3.3-5.6 7-5.6s6.2 1.8 7 5.6" />
              </svg>
            </Link>

            <button
              type="button"
              className="icon-btn"
              aria-label="Giỏ hàng"
              onClick={() => setCartOpen(true)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M6 8h12l1 12H5L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="overlay-backdrop"
          style={{ justifyContent: 'flex-start' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>LumaWear</h2>
              <button
                type="button"
                className="close-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="drawer-body">
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <input
                  className="field-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Tìm
                </button>
              </form>
              <div style={{ display: 'grid', gap: 14, fontSize: 16 }}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Trang chủ
                </Link>
                <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                  Tất cả sản phẩm
                </Link>
                {categories.slice(1).map((cat) => (
                  <Link
                    key={cat}
                    to={categoryPath(cat)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
                <hr style={{ border: 0, borderTop: '1px solid var(--border)', width: '100%' }} />
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  Giỏ hàng ({cartCount})
                </Link>
                <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                  Tài khoản &amp; Đơn hàng
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useStore()
  const [activeSwatch, setActiveSwatch] = useState(0)
  const wished = isWishlisted(product.id)

  const discountPct =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0

  const currentSwatch = product.swatches?.[activeSwatch]

  return (
    <article className="product-card">
      <div className="product-media" style={{ background: product.color || '#F8F7F4' }}>
        <Link to={`/product/${product.id}`} className="product-media-link">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        <div className="product-badges">
          {product.badge && <span className="badge-tag">{product.badge}</span>}
          {discountPct > 0 && <span className="badge-tag sale">-{discountPct}%</span>}
        </div>

        <button
          type="button"
          className={`wishlist-btn${wished ? ' active' : ''}`}
          aria-label={wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          onClick={() => toggleWishlist(product)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 20.4s-7-4.5-9.2-8.4C1.2 9.1 2.7 5.5 6.2 5.1c2-.2 3.7.8 4.8 2.3 1.1-1.5 2.8-2.5 4.8-2.3 3.5.4 5 4 3.4 6.9-2.2 3.9-9.2 8.4-9.2 8.4Z" />
          </svg>
        </button>

        <div className="product-quick-actions">
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => setQuickViewProduct(product)}
          >
            Xem nhanh
          </button>
          <button
            type="button"
            className="quick-action-btn dark"
            onClick={() =>
              addToCart(product, {
                color: currentSwatch?.name,
                size: product.sizes?.[0],
              })
            }
          >
            + Thêm giỏ
          </button>
        </div>
      </div>

      <div className="product-meta-top">
        <span>{product.category}</span>
        <span className="product-rating">
          ★ {product.rating} · Đã bán {product.sold}
        </span>
      </div>

      <h3 className="product-name">
        <Link to={`/product/${product.id}`}>{product.name}</Link>
      </h3>

      <div className="product-price-row">
        <span className="product-price">{formatPrice(product.price)}</span>
        {product.oldPrice > product.price && (
          <span className="product-old-price">{formatPrice(product.oldPrice)}</span>
        )}
      </div>

      {product.swatches?.length > 0 && (
        <div className="swatch-row">
          {product.swatches.map((sw, idx) => (
            <button
              key={sw.name}
              type="button"
              className={`swatch-dot${idx === activeSwatch ? ' active' : ''}`}
              title={sw.name}
              aria-label={`Chọn màu ${sw.name}`}
              onClick={() => setActiveSwatch(idx)}
            >
              <span style={{ background: sw.hex }} />
            </button>
          ))}
          <span className="swatch-label">{currentSwatch?.name}</span>
        </div>
      )}
    </article>
  )
}

function Home({ products }) {
  const { showToast } = useStore()
  const featured = products.slice(0, 8)
  const newArrivals = products.filter((p) => p.isNew || p.badge === 'Mới').slice(0, 4)

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
              LumaWear tôn vinh phom dáng chuẩn mực, chất liệu tự nhiên như linen Bỉ, lụa Tencel
              và cotton hữu cơ — dễ phối, bền dáng và vượt thời gian.
            </p>
            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-primary">
                Khám phá bộ sưu tập
              </Link>
              <Link to="/products?sort=new" className="btn btn-outline">
                Hàng mới về
              </Link>
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
            {categoryMeta.map((cat) => (
              <Link key={cat.name} to={categoryPath(cat.name)} className="category-card">
                <img src={cat.image} alt={cat.name} loading="lazy" />
                <div className="category-card-body">
                  <h3>{cat.name}</h3>
                  <span>{cat.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cream">
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
        <div className="editorial-banner-grid">
          <div className="editorial-banner-copy">
            <p className="eyebrow">Ưu đãi đặc quyền trực tuyến</p>
            <h2>Hoàn thiện tủ đồ tối giản của riêng bạn</h2>
            <p>
              Áp dụng mã ưu đãi trực tiếp trong giỏ hàng trượt và nhận miễn phí vận chuyển toàn quốc
              cho đơn từ 1.000.000₫.
            </p>
            <div className="coupon-pill">
              <span>Mã ưu đãi 10%:</span>
              <strong>LUMA10</strong>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#e4cfa9', color: '#111', padding: '6px 12px' }}
                onClick={copyCoupon}
              >
                Sao chép
              </button>
            </div>
            <div>
              <Link
                to="/products"
                className="btn"
                style={{ background: '#ffffff', color: '#111111' }}
              >
                Mua sắm ngay
              </Link>
            </div>
          </div>
          <div className="editorial-banner-media">
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

function Products({ products }) {
  const { search } = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(search)
  const rawCat = params.get('category') || 'Tất cả'
  const activeCat = categories.includes(rawCat) ? rawCat : 'Tất cả'
  const initialQuery = params.get('q') || ''
  const initialSort = params.get('sort') || 'featured'

  const [query, setQuery] = useState(initialQuery)
  const [sortBy, setSortBy] = useState(initialSort)

  useEffect(() => {
    setQuery(params.get('q') || '')
    setSortBy(params.get('sort') || 'featured')
  }, [search])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = activeCat === 'Tất cả' || p.category === activeCat
      const q = query.trim().toLowerCase()
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      return matchCat && matchQ
    })

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'new') {
      list = [...list].sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)))
    } else if (sortBy === 'sale') {
      list = [...list].sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0
        const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0
        return db - da
      })
    } else {
      list = [...list].sort((a, b) => (b.sold || 0) - (a.sold || 0))
    }
    return list
  }, [products, activeCat, query, sortBy])

  return (
    <>
      <div className="catalog-header">
        <div className="container">
          <p className="eyebrow">LumaWear Collection</p>
          <h1>{activeCat === 'Tất cả' ? 'Tất cả thiết kế' : activeCat}</h1>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Tuyển chọn trang phục tối giản, tinh xảo trong từng đường cắt và chất liệu.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="catalog-toolbar">
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill${activeCat === cat ? ' active' : ''}`}
                  onClick={() => navigate(categoryPath(cat))}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-controls">
              <input
                className="catalog-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Lọc theo tên thiết kế..."
                aria-label="Lọc sản phẩm"
              />
              <select
                className="catalog-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sắp xếp sản phẩm"
              >
                <option value="featured">Sắp xếp: Phổ biến nhất</option>
                <option value="new">Hàng mới nhất</option>
                <option value="sale">Ưu đãi nhiều nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          <div className="results-meta">
            <span>Hiển thị {filtered.length} sản phẩm</span>
            {(activeCat !== 'Tất cả' || query) && (
              <button
                type="button"
                className="remove-link"
                style={{ margin: 0 }}
                onClick={() => {
                  setQuery('')
                  navigate('/products')
                }}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Không tìm thấy thiết kế phù hợp</h3>
              <p>Hãy thử từ khóa khác hoặc xem toàn bộ bộ sưu tập của LumaWear.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setQuery('')
                  navigate('/products')
                }}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function ProductDetail({ products }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const product = products.find((p) => p.id === Number(id))

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (product) {
      setSelectedColor(product.swatches?.[0]?.name || 'Mặc định')
      setSelectedSize(product.sizes?.[0] || 'M')
      setQty(1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [product])

  if (!product) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Sản phẩm này có thể đã hết hàng hoặc không tồn tại.</p>
            <Link to="/products" className="btn btn-primary">
              Quay lại bộ sưu tập
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const wished = isWishlisted(product.id)
  const discountPct =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const handleBuyNow = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      qty,
      openDrawer: false,
    })
    navigate('/checkout')
  }

  return (
    <section className="section" style={{ paddingTop: 36 }}>
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <Link to={categoryPath(product.category)}>{product.category}</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{product.name}</span>
        </div>

        <div className="detail-grid">
          <div className="detail-gallery">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="detail-info">
            <p className="eyebrow">{product.category} · LumaWear Studio</p>
            <h1>{product.name}</h1>

            <div className="detail-rating-row">
              <span className="product-rating">★ {product.rating} / 5.0</span>
              <span>•</span>
              <span>Đã bán {product.sold} sản phẩm</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price">{formatPrice(product.price)}</span>
              {product.oldPrice > product.price && (
                <span className="detail-old-price">{formatPrice(product.oldPrice)}</span>
              )}
              {discountPct > 0 && (
                <span className="detail-discount-pill">Tiết kiệm {discountPct}%</span>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            {product.swatches?.length > 0 && (
              <div className="option-group">
                <div className="option-label">
                  Màu sắc <span>{selectedColor}</span>
                </div>
                <div className="swatch-row">
                  {product.swatches.map((sw) => (
                    <button
                      key={sw.name}
                      type="button"
                      className={`swatch-dot${selectedColor === sw.name ? ' active' : ''}`}
                      style={{ width: 28, height: 28 }}
                      title={sw.name}
                      onClick={() => setSelectedColor(sw.name)}
                    >
                      <span style={{ background: sw.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="option-group">
              <div className="option-label">
                Kích thước <span>{selectedSize}</span>
              </div>
              <div className="size-grid">
                {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn${selectedSize === size ? ' active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <div className="option-label">Số lượng</div>
              <div className="qty-stepper">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="detail-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  addToCart(product, { color: selectedColor, size: selectedSize, qty })
                }
              >
                Thêm vào giỏ
              </button>
              <button type="button" className="btn btn-outline" onClick={handleBuyNow}>
                Mua ngay
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                aria-label="Yêu thích"
                onClick={() => toggleWishlist(product)}
                style={{ padding: '0 16px' }}
              >
                {wished ? '♥' : '♡'}
              </button>
            </div>

            <div className="detail-specs">
              <div>
                <strong>Chất liệu:</strong> {product.fabric}
              </div>
              <div>
                <strong>Vận chuyển:</strong> Miễn phí cho đơn từ 1.000.000₫ (2–4 ngày toàn quốc).
              </div>
              <div>
                <strong>Ưu đãi:</strong> Nhập mã <strong>LUMA10</strong> để giảm 10% tại bước giỏ hàng.
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 84 }}>
            <div className="section-header">
              <div>
                <p className="eyebrow">Gợi ý phối đồ</p>
                <h2 className="section-title">Thiết kế tương tự</h2>
              </div>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function CartPage() {
  const {
    cart,
    updateCartQty,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    grandTotal,
  } = useStore()
  const navigate = useNavigate()

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <p className="eyebrow">Shopping Bag</p>
        <h1 className="section-title" style={{ marginBottom: 28 }}>
          Giỏ hàng của bạn
        </h1>

        {cart.length === 0 ? (
          <div className="empty-state">
            <h3>Giỏ hàng đang trống</h3>
            <p>Hãy khám phá những thiết kế tối giản mới nhất từ LumaWear.</p>
            <Link to="/products" className="btn btn-primary">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="page-split">
            <div>
              <FreeShippingBar />
              {cart.map((item) => (
                <div className="cart-item-row" key={item.variantKey}>
                  <img src={item.image} alt={item.name} className="cart-thumb" />
                  <div>
                    <h3 className="cart-item-title">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="cart-item-variant">
                      Màu: {item.color} · Size: {item.size}
                    </p>
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.variantKey, item.qty - 1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQty(item.variantKey, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="remove-link"
                        onClick={() => removeFromCart(item.variantKey)}
                      >
                        Xóa sản phẩm
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary-card">
              <h2>Tóm tắt đơn hàng</h2>
              <CouponBox />
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá (LUMA10)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
              </div>
              <div className="summary-total">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(grandTotal)}</strong>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-full"
                style={{ marginTop: 22 }}
                onClick={() => navigate('/checkout')}
              >
                Tiến hành thanh toán
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

function CheckoutPage() {
  const { cart, subtotal, discount, shipping, grandTotal, couponCode, createOrder } =
    useStore()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const order = createOrder({
      customer: form,
      paymentMethod,
      couponCode,
      subtotal,
      discount,
      shipping,
      total: grandTotal,
      items: cart,
    })
    setConfirmedOrder(order)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (confirmedOrder) {
    return (
      <section className="section">
        <div className="container">
          <div className="order-confirm-card">
            <div className="order-confirm-icon">✓</div>
            <p className="eyebrow">Đặt hàng thành công</p>
            <h1>Cảm ơn bạn đã chọn LumaWear</h1>
            <p style={{ color: 'var(--muted)' }}>
              Đơn hàng của bạn đã được ghi nhận và đang được đội ngũ LumaWear xử lý.
            </p>
            <div className="order-code-pill">{confirmedOrder.code}</div>
            <div
              style={{
                textAlign: 'left',
                borderTop: '1px solid var(--border)',
                paddingTop: 18,
                marginBottom: 26,
                fontSize: 13.5,
                display: 'grid',
                gap: 8,
              }}
            >
              <div>
                <strong>Người nhận:</strong> {confirmedOrder.customer.fullName} —{' '}
                {confirmedOrder.customer.phone}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {confirmedOrder.customer.address}
              </div>
              <div>
                <strong>Thanh toán:</strong>{' '}
                {confirmedOrder.paymentMethod === 'QR'
                  ? 'Chuyển khoản VietQR'
                  : 'Thanh toán khi nhận hàng (COD)'}
              </div>
              <div>
                <strong>Tổng cộng:</strong> {formatPrice(confirmedOrder.total)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/account" className="btn btn-primary">
                Xem lịch sử đơn hàng
              </Link>
              <Link to="/products" className="btn btn-outline">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <h3>Chưa có sản phẩm để thanh toán</h3>
            <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành đặt hàng.</p>
            <Link to="/products" className="btn btn-primary">
              Khám phá bộ sưu tập
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <p className="eyebrow">Checkout</p>
        <h1 className="section-title" style={{ marginBottom: 28 }}>
          Thông tin giao hàng &amp; Thanh toán
        </h1>

        <div className="page-split">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div>
                <label className="field-label">Họ và tên *</label>
                <input
                  required
                  className="field-input"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nguyễn Minh Anh"
                />
              </div>
              <div>
                <label className="field-label">Số điện thoại *</label>
                <input
                  required
                  type="tel"
                  className="field-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0912 345 678"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Email nhận xác nhận</label>
              <input
                type="email"
                className="field-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ban@email.com"
              />
            </div>

            <div>
              <label className="field-label">Địa chỉ giao hàng *</label>
              <input
                required
                className="field-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </div>

            <div>
              <label className="field-label">Ghi chú đơn hàng</label>
              <textarea
                className="field-textarea"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <label className="field-label">Phương thức thanh toán</label>
              <div className="payment-options">
                <label
                  className={`payment-option${paymentMethod === 'COD' ? ' active' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div>
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <span>Kiểm tra sản phẩm trước khi thanh toán tiền mặt cho shipper.</span>
                  </div>
                </label>

                <label
                  className={`payment-option${paymentMethod === 'QR' ? ' active' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'QR'}
                    onChange={() => setPaymentMethod('QR')}
                  />
                  <div>
                    <strong>Chuyển khoản ngân hàng (VietQR)</strong>
                    <span>Quét mã QR nhanh chóng, xác nhận đơn tức thì.</span>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === 'QR' && (
              <div className="qr-box">
                <div className="qr-visual" aria-label="Mã QR chuyển khoản VietQR">
                  <svg viewBox="0 0 100 100" width="120" height="120">
                    <rect width="100" height="100" fill="#fff" />
                    <rect x="6" y="6" width="26" height="26" fill="#111" />
                    <rect x="11" y="11" width="16" height="16" fill="#fff" />
                    <rect x="15" y="15" width="8" height="8" fill="#111" />
                    <rect x="68" y="6" width="26" height="26" fill="#111" />
                    <rect x="73" y="11" width="16" height="16" fill="#fff" />
                    <rect x="77" y="15" width="8" height="8" fill="#111" />
                    <rect x="6" y="68" width="26" height="26" fill="#111" />
                    <rect x="11" y="73" width="16" height="16" fill="#fff" />
                    <rect x="15" y="77" width="8" height="8" fill="#111" />
                    <rect x="40" y="10" width="8" height="8" fill="#111" />
                    <rect x="52" y="18" width="8" height="8" fill="#111" />
                    <rect x="38" y="38" width="24" height="24" fill="#9a7b56" />
                    <rect x="44" y="44" width="12" height="12" fill="#fff" />
                    <rect x="14" y="42" width="14" height="10" fill="#111" />
                    <rect x="70" y="44" width="20" height="10" fill="#111" />
                    <rect x="42" y="70" width="12" height="20" fill="#111" />
                    <rect x="62" y="68" width="12" height="12" fill="#111" />
                    <rect x="78" y="78" width="14" height="14" fill="#111" />
                  </svg>
                </div>
                <div className="qr-details">
                  <p>
                    <strong>Ngân hàng:</strong> Vietcombank — CN Hà Nội
                  </p>
                  <p>
                    <strong>Số tài khoản:</strong> 1028 6688 9999
                  </p>
                  <p>
                    <strong>Chủ tài khoản:</strong> LUMAWEAR STUDIO
                  </p>
                  <p>
                    <strong>Số tiền:</strong> {formatPrice(grandTotal)}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>
                    Nội dung: LUMAWEAR + Số điện thoại đặt hàng
                  </p>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
              Xác nhận đặt hàng · {formatPrice(grandTotal)}
            </button>
          </form>

          <aside className="summary-card">
            <h2>Đơn hàng ({cart.length})</h2>
            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              {cart.map((item) => (
                <div
                  key={item.variantKey}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px 1fr auto',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 52, height: 66, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                      {item.color} / {item.size} × {item.qty}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {formatPrice(item.price * item.qty)}
                  </div>
                </div>
              ))}
            </div>
            <CouponBox />
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Giảm giá ({couponCode})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Vận chuyển</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
            </div>
            <div className="summary-total">
              <span>Tổng cộng</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function AccountPage() {
  const { orders, wishlist, setWishlistOpen } = useStore()

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <p className="eyebrow">My LumaWear</p>
        <h1 className="section-title" style={{ marginBottom: 28 }}>
          Tài khoản thành viên
        </h1>

        <div className="account-hero">
          <div className="account-identity">
            <div className="account-avatar">L</div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, margin: '0 0 4px' }}>
                Khách hàng LumaWear
              </h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
                Hạng thành viên Editorial · Ưu đãi mã LUMA10 (-10%)
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setWishlistOpen(true)}
          >
            Danh sách yêu thích ({wishlist.length})
          </button>
        </div>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, marginBottom: 18 }}>
          Lịch sử đơn hàng ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>Bạn chưa có đơn hàng nào</h3>
            <p>Các đơn hàng bạn đặt sẽ được lưu tự động tại đây.</p>
            <Link to="/products" className="btn btn-primary">
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.code}>
              <div className="order-card-top">
                <div>
                  <strong>{order.code}</strong>
                  <span style={{ marginLeft: 12, color: 'var(--muted)', fontSize: 12.5 }}>
                    Ngày đặt: {order.date}
                  </span>
                </div>
                <span className="order-status">{order.status}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  fontSize: 13.5,
                }}
              >
                <span style={{ color: 'var(--muted)' }}>
                  Phương thức:{' '}
                  {order.paymentMethod === 'QR' ? 'Chuyển khoản VietQR' : 'COD'}
                  {order.items?.length ? ` · ${order.items.length} dòng sản phẩm` : ''}
                </span>
                <strong style={{ fontSize: 16 }}>{formatPrice(order.total)}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateCartQty,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    grandTotal,
    cartCount,
  } = useStore()
  const navigate = useNavigate()

  if (!cartOpen) return null

  return (
    <div className="overlay-backdrop" onClick={() => setCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Giỏ hàng ({cartCount})</h2>
          <button type="button" className="close-btn" onClick={() => setCartOpen(false)}>
            ×
          </button>
        </div>

        <div className="drawer-body">
          <FreeShippingBar />
          {cart.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 16px' }}>
              <h3>Giỏ hàng trống</h3>
              <p>Thêm sản phẩm yêu thích để trải nghiệm mua sắm tại LumaWear.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/products')
                }}
              >
                Xem bộ sưu tập
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item-row" key={item.variantKey}>
                <img src={item.image} alt={item.name} className="cart-thumb" />
                <div>
                  <h4 className="cart-item-title">{item.name}</h4>
                  <p className="cart-item-variant">
                    {item.color} · {item.size}
                  </p>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.variantKey, item.qty - 1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.variantKey, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                    {formatPrice(item.price * item.qty)}
                  </div>
                  <button
                    type="button"
                    className="remove-link"
                    onClick={() => removeFromCart(item.variantKey)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <CouponBox />
            <div className="summary-row">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span>Giảm giá (LUMA10)</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Vận chuyển</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
            </div>
            <div className="summary-total" style={{ marginBottom: 16 }}>
              <span>Tổng cộng</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/cart')
                }}
              >
                Xem giỏ hàng
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/checkout')
                }}
              >
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist, addToCart } = useStore()

  if (!wishlistOpen) return null

  return (
    <div className="overlay-backdrop" onClick={() => setWishlistOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Yêu thích ({wishlist.length})</h2>
          <button
            type="button"
            className="close-btn"
            onClick={() => setWishlistOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 16px' }}>
              <h3>Chưa có sản phẩm yêu thích</h3>
              <p>Nhấn biểu tượng trái tim trên sản phẩm để lưu lại xem sau.</p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div className="cart-item-row" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-thumb" />
                <div>
                  <h4 className="cart-item-title">
                    <Link
                      to={`/product/${item.id}`}
                      onClick={() => setWishlistOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </h4>
                  <div style={{ fontWeight: 600, margin: '4px 0 10px' }}>
                    {formatPrice(item.price)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      addToCart(item)
                      setWishlistOpen(false)
                    }}
                  >
                    + Thêm vào giỏ
                  </button>
                </div>
                <button
                  type="button"
                  className="remove-link"
                  onClick={() => toggleWishlist(item)}
                >
                  Bỏ lưu
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore()
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColor(quickViewProduct.swatches?.[0]?.name || 'Mặc định')
      setSelectedSize(quickViewProduct.sizes?.[0] || 'M')
    }
  }, [quickViewProduct])

  if (!quickViewProduct) return null

  return (
    <div className="modal-backdrop" onClick={() => setQuickViewProduct(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="close-btn modal-close-floating"
          aria-label="Đóng xem nhanh"
          onClick={() => setQuickViewProduct(null)}
        >
          ×
        </button>

        <div className="modal-media">
          <img src={quickViewProduct.image} alt={quickViewProduct.name} />
        </div>

        <div className="modal-body">
          <p className="eyebrow">{quickViewProduct.category}</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, margin: '0 0 8px' }}>
            {quickViewProduct.name}
          </h2>
          <div className="product-price-row" style={{ marginBottom: 14 }}>
            <span className="detail-price" style={{ fontSize: 22 }}>
              {formatPrice(quickViewProduct.price)}
            </span>
            {quickViewProduct.oldPrice > quickViewProduct.price && (
              <span className="detail-old-price">
                {formatPrice(quickViewProduct.oldPrice)}
              </span>
            )}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 20 }}>
            {quickViewProduct.description}
          </p>

          {quickViewProduct.swatches?.length > 0 && (
            <div className="option-group">
              <div className="option-label">
                Màu sắc <span>{selectedColor}</span>
              </div>
              <div className="swatch-row">
                {quickViewProduct.swatches.map((sw) => (
                  <button
                    key={sw.name}
                    type="button"
                    className={`swatch-dot${selectedColor === sw.name ? ' active' : ''}`}
                    style={{ width: 24, height: 24 }}
                    onClick={() => setSelectedColor(sw.name)}
                  >
                    <span style={{ background: sw.hex }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="option-group">
            <div className="option-label">
              Kích thước <span>{selectedSize}</span>
            </div>
            <div className="size-grid">
              {(quickViewProduct.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn${selectedSize === size ? ' active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => {
                addToCart(quickViewProduct, {
                  color: selectedColor,
                  size: selectedSize,
                })
                setQuickViewProduct(null)
              }}
            >
              Thêm vào giỏ hàng
            </button>
            <Link
              to={`/product/${quickViewProduct.id}`}
              className="btn btn-outline btn-full"
              onClick={() => setQuickViewProduct(null)}
            >
              Xem chi tiết đầy đủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ToastContainer() {
  const { toasts } = useStore()
  if (toasts.length === 0) return null
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item">
          {t.message}
        </div>
      ))}
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand-logo">
            <span className="brand-logo-main">LumaWear</span>
            <span className="brand-logo-sub">Editorial Wardrobe</span>
          </Link>
          <p>
            Thời trang tối giản, thanh lịch cho nhịp sống hiện đại. Chú trọng chất liệu tự nhiên và
            phom dáng bền vững theo thời gian.
          </p>
        </div>

        <div className="footer-col">
          <h4>Danh mục</h4>
          <ul>
            {categories.slice(1).map((cat) => (
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
        <span>Editorial Minimalist Edition · Made in Vietnam</span>
      </div>
    </footer>
  )
}

function App() {
  const [products, setProducts] = useState(localProducts)

  useEffect(() => {
    let active = true
    fetchProducts()
      .then((items) => {
        if (active && Array.isArray(items) && items.length > 0) {
          setProducts(items.map(normalizeProduct))
        }
      })
      .catch(() => {
        // Khi không bật FastAPI backend (ví dụ deploy tĩnh GitHub Pages),
        // tự động dùng bộ dữ liệu editorial localProducts.
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <ToastContainer />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </HashRouter>
)
