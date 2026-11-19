import React from 'react'
import { formatPrice } from '../../domain/catalog'

export function PriceDisplay({ price, oldPrice, size = 'md' }) {
  return (
    <div className={`ds-price ds-price--${size}`}>
      <span className="ds-price__current">{formatPrice(price)}</span>
      {oldPrice > price && (
        <span className="ds-price__old">{formatPrice(oldPrice)}</span>
      )}
    </div>
  )
}
