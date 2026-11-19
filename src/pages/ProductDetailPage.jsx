import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/commerce/ProductCard'
import {
  Badge,
  Button,
  EmptyState,
  PriceDisplay,
  QuantityStepper,
  SwatchPicker,
} from '../components/ui'
import { categoryPath, getDiscountPercent } from '../domain/catalog'
import { useCart } from '../state/CartContext'
import { useWishlist } from '../state/WishlistContext'

export function ProductDetailPage({ products }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
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
          <EmptyState
            title="Không tìm thấy sản phẩm"
            description="Sản phẩm này có thể đã hết hàng hoặc không tồn tại."
            action={<Button to="/products">Quay lại bộ sưu tập</Button>}
          />
        </div>
      </section>
    )
  }

  const wished = isWishlisted(product.id)
  const discountPct = getDiscountPercent(product.price, product.oldPrice)
  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const handleBuyNow = () => {
    addItem(product, {
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
          <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
        </div>

        <div className="detail-grid">
          <div className="detail-gallery">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="detail-info">
            <p className="eyebrow">{product.category} · LumaWear Studio</p>
            <h1>{product.name}</h1>

            <div className="detail-rating-row">
              <span className="product-card__rating">★ {product.rating} / 5.0</span>
              <span>•</span>
              <span>Đã bán {product.sold} sản phẩm</span>
            </div>

            <div className="detail-price-box">
              <PriceDisplay
                price={product.price}
                oldPrice={product.oldPrice}
                size="lg"
              />
              {discountPct > 0 && (
                <Badge tone="subtle">Tiết kiệm {discountPct}%</Badge>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            {product.swatches?.length > 0 && (
              <div className="option-group">
                <div className="option-label">
                  Màu sắc <span>{selectedColor}</span>
                </div>
                <SwatchPicker
                  swatches={product.swatches}
                  value={selectedColor}
                  onChange={setSelectedColor}
                  size="md"
                />
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
                    className={`size-btn${
                      selectedSize === size ? ' size-btn--active' : ''
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <div className="option-label">Số lượng</div>
              <QuantityStepper value={qty} min={1} onChange={setQty} />
            </div>

            <div className="detail-actions">
              <Button
                onClick={() =>
                  addItem(product, {
                    color: selectedColor,
                    size: selectedSize,
                    qty,
                  })
                }
              >
                Thêm vào giỏ
              </Button>
              <Button variant="outline" onClick={handleBuyNow}>
                Mua ngay
              </Button>
              <Button
                variant="ghost"
                aria-label="Yêu thích"
                onClick={() => toggleWishlist(product)}
                style={{ padding: '0 16px' }}
              >
                {wished ? '♥' : '♡'}
              </Button>
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
