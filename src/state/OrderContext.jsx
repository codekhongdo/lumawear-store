import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createOrderRecord } from '../domain/orderFactory'
import { storageService } from '../services/storageService'
import { useCart } from './CartContext'
import { useUI } from './UIContext'

const ORDERS_STORAGE_KEY = 'lumawear-orders'
const OrderContext = createContext(null)

function readInitialOrders() {
  const saved = storageService.read(ORDERS_STORAGE_KEY, null)
  if (Array.isArray(saved)) return saved
  const legacy = storageService.read('lumawear-last-order', null)
  return legacy
    ? [{ code: 'LW-2026-0001', ...legacy, items: [], paymentMethod: 'COD' }]
    : []
}

export function OrderProvider({ children }) {
  const { items, couponCode, pricing, clearCart } = useCart()
  const { showToast } = useUI()
  const [orders, setOrders] = useState(readInitialOrders)

  useEffect(() => {
    storageService.write(ORDERS_STORAGE_KEY, orders)
  }, [orders])

  const placeOrder = useCallback(
    ({ customer, paymentMethod }) => {
      const order = createOrderRecord({
        customer,
        paymentMethod,
        couponCode,
        pricing,
        items,
      })
      setOrders((prev) => [order, ...prev])
      storageService.write('lumawear-last-order', order)
      clearCart()
      showToast(`Đặt hàng thành công! Mã đơn ${order.code}`)
      return order
    },
    [items, couponCode, pricing, clearCart, showToast]
  )

  const value = useMemo(() => ({ orders, placeOrder }), [orders, placeOrder])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export const useOrders = () => useContext(OrderContext)
