import React from 'react'
import { formatPrice } from '../../domain/catalog'
import { useCart } from '../../state/CartContext'

export function FreeShippingBar() {
  const { pricing } = useCart()
  if (pricing.subtotal === 0) return null

  return (
    <div className="freeship-box">
      {pricing.freeShipRemaining > 0 ? (
        <span>
          Mua thêm <strong>{formatPrice(pricing.freeShipRemaining)}</strong> để
          được <strong>Miễn phí vận chuyển</strong>
        </span>
      ) : (
        <span>
          Đơn hàng của bạn đã đủ điều kiện <strong>Miễn phí vận chuyển</strong>
        </span>
      )}
      <div className="freeship-track">
        <div
          className={`freeship-fill${
            pricing.freeShipRemaining === 0 ? ' freeship-fill--done' : ''
          }`}
          style={{ width: `${pricing.freeShipProgress}%` }}
        />
      </div>
    </div>
  )
}
