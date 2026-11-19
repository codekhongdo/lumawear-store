import React, { useState } from 'react'
import { useCart } from '../../state/CartContext'
import { Button } from '../ui'

export function CouponBox() {
  const { couponCode, pricing, applyCoupon, removeCoupon } = useCart()
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (applyCoupon(input)) {
      setInput('')
    }
  }

  if (pricing.activeCoupon) {
    return (
      <div className="coupon-applied">
        <span>
          Đã áp dụng <strong>{couponCode}</strong> ({pricing.activeCoupon.label})
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
        className="ds-input"
        style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Mã giảm giá (VD: LUMA10)"
        aria-label="Mã giảm giá"
      />
      <Button type="submit" variant="outline" size="sm">
        Áp dụng
      </Button>
    </form>
  )
}
