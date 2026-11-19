/**
 * Strategy Pattern cho tính toán mã giảm giá & vận chuyển.
 * Dễ mở rộng thêm coupon cố định, giảm theo danh mục, hoặc freeship voucher
 * mà không cần sửa đổi logic component.
 */

export const FREE_SHIPPING_THRESHOLD = 1000000
export const STANDARD_SHIPPING_FEE = 35000

const percentageCoupon = (code, rate, label) => ({
  code,
  label,
  calculateDiscount: (subtotal) => Math.round(subtotal * rate),
})

export const COUPON_STRATEGIES = {
  LUMA10: percentageCoupon('LUMA10', 0.1, 'Giảm 10% toàn bộ đơn hàng'),
}

export function resolveCouponStrategy(rawCode) {
  const code = (rawCode || '').trim().toUpperCase()
  return COUPON_STRATEGIES[code] || null
}

export function calculateOrderPricing(cartItems, couponCode) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const couponStrategy = resolveCouponStrategy(couponCode)
  const discount = couponStrategy ? couponStrategy.calculateDiscount(subtotal) : 0
  const afterDiscount = Math.max(0, subtotal - discount)
  const shipping =
    subtotal === 0 || afterDiscount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE
  const grandTotal = afterDiscount + shipping
  const freeShipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount)
  const freeShipProgress = Math.min(
    100,
    Math.round((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100)
  )

  return {
    subtotal,
    itemCount,
    activeCoupon: couponStrategy,
    discount,
    shipping,
    grandTotal,
    freeShipRemaining,
    freeShipProgress,
  }
}
