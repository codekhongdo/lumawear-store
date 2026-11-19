import React, { useState } from 'react'
import { CouponBox } from '../components/commerce/CouponBox'
import { Button, EmptyState, Field } from '../components/ui'
import { formatPrice } from '../domain/catalog'
import { useCart } from '../state/CartContext'
import { useOrders } from '../state/OrderContext'

export function CheckoutPage() {
  const { items, pricing, couponCode } = useCart()
  const { placeOrder } = useOrders()
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
    const order = placeOrder({ customer: form, paymentMethod })
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
            <p style={{ color: 'var(--color-text-muted)' }}>
              Đơn hàng của bạn đã được ghi nhận và đang được đội ngũ LumaWear xử lý.
            </p>
            <div className="order-code-pill">{confirmedOrder.code}</div>
            <div
              style={{
                textAlign: 'left',
                borderTop: '1px solid var(--color-border)',
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
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button to="/account">Xem lịch sử đơn hàng</Button>
              <Button to="/products" variant="outline">
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="section">
        <div className="container">
          <EmptyState
            title="Chưa có sản phẩm để thanh toán"
            description="Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành đặt hàng."
            action={<Button to="/products">Khám phá bộ sưu tập</Button>}
          />
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
              <Field label="Họ và tên *" htmlFor="fullName">
                <input
                  id="fullName"
                  required
                  className="ds-input"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nguyễn Minh Anh"
                />
              </Field>
              <Field label="Số điện thoại *" htmlFor="phone">
                <input
                  id="phone"
                  required
                  type="tel"
                  className="ds-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0912 345 678"
                />
              </Field>
            </div>

            <Field label="Email nhận xác nhận" htmlFor="email">
              <input
                id="email"
                type="email"
                className="ds-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ban@email.com"
              />
            </Field>

            <Field label="Địa chỉ giao hàng *" htmlFor="address">
              <input
                id="address"
                required
                className="ds-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
              />
            </Field>

            <Field label="Ghi chú đơn hàng" htmlFor="note">
              <textarea
                id="note"
                className="ds-textarea"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
              />
            </Field>

            <div style={{ marginTop: 8 }}>
              <span className="ds-field__label" style={{ display: 'block', marginBottom: 8 }}>
                Phương thức thanh toán
              </span>
              <div className="payment-options">
                <label
                  className={`payment-option${
                    paymentMethod === 'COD' ? ' payment-option--active' : ''
                  }`}
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
                  className={`payment-option${
                    paymentMethod === 'QR' ? ' payment-option--active' : ''
                  }`}
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
                    <strong>Số tiền:</strong> {formatPrice(pricing.grandTotal)}
                  </p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
                    Nội dung: LUMAWEAR + Số điện thoại đặt hàng
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" fullWidth style={{ marginTop: 8 }}>
              Xác nhận đặt hàng · {formatPrice(pricing.grandTotal)}
            </Button>
          </form>

          <aside className="summary-card">
            <h2>Đơn hàng ({items.length})</h2>
            <div style={{ display: 'grid', gap: 14, marginBottom: 18 }}>
              {items.map((item) => (
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
                    <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
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
                {pricing.shipping === 0
                  ? 'Miễn phí'
                  : formatPrice(pricing.shipping)}
              </span>
            </div>
            <div className="summary-total">
              <span>Tổng cộng</span>
              <strong>{formatPrice(pricing.grandTotal)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
