/**
 * Factory Pattern khởi tạo thực thể đơn hàng chuẩn hóa.
 */

export function createOrderRecord({
  customer,
  paymentMethod,
  couponCode,
  pricing,
  items,
}) {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  return {
    code: `LW-2026-${randomSuffix}`,
    date: new Date().toLocaleDateString('vi-VN'),
    status:
      paymentMethod === 'QR'
        ? 'Chờ xác nhận chuyển khoản'
        : 'Đang chuẩn bị hàng',
    customer,
    paymentMethod,
    couponCode: couponCode || '',
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shipping: pricing.shipping,
    total: pricing.grandTotal,
    items: items.map((item) => ({ ...item })),
  }
}
