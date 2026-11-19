import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import {
  calculateOrderPricing,
  resolveCouponStrategy,
} from '../domain/pricingStrategy'
import { storageService } from '../services/storageService'
import { useUI } from './UIContext'

const CART_STORAGE_KEY = 'lumawear-cart'
const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, size, qty } = action.payload
      const variantKey = `${product.id}__${color}__${size}`
      const existing = state.find((item) => item.variantKey === variantKey)
      if (existing) {
        return state.map((item) =>
          item.variantKey === variantKey ? { ...item, qty: item.qty + qty } : item
        )
      }
      return [
        ...state,
        {
          variantKey,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color,
          size,
          qty,
        },
      ]
    }
    case 'UPDATE_QTY': {
      const { variantKey, qty } = action.payload
      if (qty < 1) {
        return state.filter((item) => item.variantKey !== variantKey)
      }
      return state.map((item) =>
        item.variantKey === variantKey ? { ...item, qty } : item
      )
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.variantKey !== action.payload.variantKey)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const { showToast, setCartOpen } = useUI()
  const [items, dispatch] = useReducer(
    cartReducer,
    undefined,
    () => storageService.read(CART_STORAGE_KEY, [])
  )
  const [couponCode, setCouponCode] = useState('')

  useEffect(() => {
    storageService.write(CART_STORAGE_KEY, items)
  }, [items])

  const addItem = useCallback(
    (product, options = {}) => {
      const color = options.color || product.swatches?.[0]?.name || 'Mặc định'
      const size = options.size || product.sizes?.[0] || 'M'
      const qty = options.qty || 1
      dispatch({ type: 'ADD_ITEM', payload: { product, color, size, qty } })
      showToast(`Đã thêm "${product.name}" (${size}) vào giỏ hàng`)
      if (options.openDrawer !== false) {
        setCartOpen(true)
      }
    },
    [showToast, setCartOpen]
  )

  const updateQty = useCallback((variantKey, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { variantKey, qty } })
  }, [])

  const removeItem = useCallback((variantKey) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { variantKey } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
    setCouponCode('')
  }, [])

  const applyCoupon = useCallback(
    (rawCode) => {
      const normalized = (rawCode || '').trim().toUpperCase()
      if (!normalized) {
        showToast('Vui lòng nhập mã giảm giá')
        return false
      }
      const strategy = resolveCouponStrategy(normalized)
      if (strategy) {
        setCouponCode(strategy.code)
        showToast(`Đã áp dụng mã ${strategy.code} (${strategy.label})`)
        return true
      }
      showToast('Mã giảm giá không hợp lệ. Thử mã LUMA10')
      return false
    },
    [showToast]
  )

  const removeCoupon = useCallback(() => {
    setCouponCode('')
    showToast('Đã gỡ mã giảm giá')
  }, [showToast])

  const pricing = useMemo(
    () => calculateOrderPricing(items, couponCode),
    [items, couponCode]
  )

  const value = useMemo(
    () => ({
      items,
      couponCode,
      pricing,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [items, couponCode, pricing, addItem, updateQty, removeItem, clearCart, applyCoupon, removeCoupon]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
