import React from 'react'
import { CartProvider } from './CartContext'
import { OrderProvider } from './OrderContext'
import { UIProvider } from './UIContext'
import { WishlistProvider } from './WishlistContext'

/**
 * Provider Composition Pattern: Tách biệt từng miền trạng thái (UI, Cart,
 * Wishlist, Order) để hạn chế re-render và giữ Single Responsibility.
 */
export function StoreProvider({ children }) {
  return (
    <UIProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>{children}</OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </UIProvider>
  )
}
