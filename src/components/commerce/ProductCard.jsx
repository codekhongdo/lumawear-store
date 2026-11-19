import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getDiscountPercent } from '../../domain/catalog'
import { useCart } from '../../state/CartContext'
import { useUI } from '../../state/UIContext'
import { useWishlist } from '../../state/WishlistContext'
import { Badge, HeartIcon, PriceDisplay, SwatchPicker } from '../ui'

export function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { setQuickViewProduct } = useUI()
  const [selectedColor, setSelectedColor] = useState(
    product.swatches?.[0]?.name || 'Mặc định'
  )

  const wished = isWishlisted(product.id)
  const discountPct = getDiscountPercent(product.price, product.oldPrice)

  return (
    <article className="product-card">
      <div
        className="product-card__media"
        style={{ background: product.color || 'var(--color-surface)' }}
      >
        <Link to={`/product/${product.id}`} className="product-card__media-link">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        <div className="product-card__badges">
          {product.badge && <Badge tone="dark">{product.badge}</Badge>}
          {discountPct > 0 && <Badge tone="accent">-{discountPct}%</Badge>}
        </div>

        <button
          type="button"
          className={`product-card__wishlist${
            wished ? ' product-card__wishlist--active' : ''
          }`}
          aria-label={wished ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={wished}
          onClick={() => toggleWishlist(product)}
        >
          <HeartIcon size={17} filled={wished} />
        </button>

        <div className="product-card__quick-actions">
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => setQuickViewProduct(product)}
          >
            Xem nhanh
          </button>
          <button
            type="button"
            className="quick-action-btn quick-action-btn--dark"
            onClick={() =>
              addItem(product, {
                color: selectedColor,
                size: product.sizes?.[0],
              })
            }
          >
            + Thêm giỏ
          </button>
        </div>
      </div>

      <div className="product-card__meta">
        <span>{product.category}</span>
        <span className="product-card__rating">
          ★ {product.rating} · Đã bán {product.sold}
        </span>
      </div>

      <h3 className="product-card__name">
        <Link to={`/product/${product.id}`}>{product.name}</Link>
      </h3>

      <div style={{ marginBottom: 10 }}>
        <PriceDisplay price={product.price} oldPrice={product.oldPrice} />
      </div>

      <SwatchPicker
        swatches={product.swatches}
        value={selectedColor}
        onChange={setSelectedColor}
        showLabel
      />
    </article>
  )
}
