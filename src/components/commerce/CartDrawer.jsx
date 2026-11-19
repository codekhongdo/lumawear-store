import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../../domain/catalog'
import { useCart } from '../../state/CartContext'
import { useUI } from '../../state/UIContext'
import { Button, Drawer, EmptyState, QuantityStepper } from '../ui'
import { CouponBox } from './CouponBox'
import { FreeShippingBar } from './FreeShippingBar'

export function CartDrawer() {
  const { items, pricing, couponCode, updateQty, removeItem } = useCart()
  const { cartOpen, setCartOpen } = useUI()
  const navigate = useNavigate()

  const go = (path) => {
    setCartOpen(false)
    navigate(path)
  }

  const footer =
    items.length > 0 ? (
      <>
        <CouponBox />
        <div className="summary-row">
          <span>Tạm tính</span>
          <span>{formatPrice(pricing.subtotal)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="summary-row summary-row--discount">
            <span>Giảm giá ({couponCode})</span>
            <span>-{formatPrice(pricing.discount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Vận chuyển</span>
          <span>
            {pricing.shipping === 0 ? 'Miễn phí' : formatPrice(pricing.shipping)}
          </span>
        </div>
        <div className="summary-total" style={{ marginBottom: 16 }}>
          <span>Tổng cộng</span>
          <strong>{formatPrice(pricing.grandTotal)}</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Button variant="outline" size="sm" onClick={() => go('/cart')}>
            Xem giỏ hàng
          </Button>
          <Button size="sm" onClick={() => go('/checkout')}>
            Thanh toán
          </Button>
        </div>
      </>
    ) : null

  return (
    <Drawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      title={`Giỏ hàng (${pricing.itemCount})`}
      footer={footer}
    >
      <FreeShippingBar />
      {items.length === 0 ? (
        <EmptyState
          compact
          title="Giỏ hàng trống"
          description="Thêm sản phẩm yêu thích để trải nghiệm mua sắm tại LumaWear."
          action={
            <Button size="sm" onClick={() => go('/products')}>
              Xem bộ sưu tập
            </Button>
          }
        />
      ) : (
        items.map((item) => (
          <div className="cart-item-row" key={item.variantKey}>
            <img src={item.image} alt={item.name} className="cart-thumb" />
            <div>
              <h4 className="cart-item-title">{item.name}</h4>
              <p className="cart-item-variant">
                {item.color} · {item.size}
              </p>
              <QuantityStepper
                value={item.qty}
                onChange={(next) => updateQty(item.variantKey, next)}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                {formatPrice(item.price * item.qty)}
              </div>
              <button
                type="button"
                className="remove-link"
                onClick={() => removeItem(item.variantKey)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </Drawer>
  )
}
