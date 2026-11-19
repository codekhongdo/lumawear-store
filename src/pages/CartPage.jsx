import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CouponBox } from '../components/commerce/CouponBox'
import { FreeShippingBar } from '../components/commerce/FreeShippingBar'
import { Button, EmptyState, QuantityStepper } from '../components/ui'
import { formatPrice } from '../domain/catalog'
import { useCart } from '../state/CartContext'

export function CartPage() {
  const { items, pricing, couponCode, updateQty, removeItem } = useCart()
  const navigate = useNavigate()

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <p className="eyebrow">Shopping Bag</p>
        <h1 className="section-title" style={{ marginBottom: 28 }}>
          Giỏ hàng của bạn
        </h1>

        {items.length === 0 ? (
          <EmptyState
            title="Giỏ hàng đang trống"
            description="Hãy khám phá những thiết kế tối giản mới nhất từ LumaWear."
            action={<Button to="/products">Tiếp tục mua sắm</Button>}
          />
        ) : (
          <div className="page-split">
            <div>
              <FreeShippingBar />
              {items.map((item) => (
                <div className="cart-item-row" key={item.variantKey}>
                  <img src={item.image} alt={item.name} className="cart-thumb" />
                  <div>
                    <h3 className="cart-item-title">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="cart-item-variant">
                      Màu: {item.color} · Size: {item.size}
                    </p>
                    <QuantityStepper
                      value={item.qty}
                      onChange={(next) => updateQty(item.variantKey, next)}
                    />
                    <div>
                      <button
                        type="button"
                        className="remove-link"
                        onClick={() => removeItem(item.variantKey)}
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
                <span>{formatPrice(pricing.subtotal)}</span>
              </div>
              {pricing.discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Giảm giá ({couponCode})</span>
                  <span>-{formatPrice(pricing.discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>
                  {pricing.shipping === 0
                    ? 'Miễn phí'
                    : formatPrice(pricing.shipping)}
                </span>
              </div>
              <div className="summary-total">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(pricing.grandTotal)}</strong>
              </div>
              <Button
                fullWidth
                style={{ marginTop: 22 }}
                onClick={() => navigate('/checkout')}
              >
                Tiến hành thanh toán
              </Button>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
