import React from 'react'
import { Badge, Button, EmptyState } from '../components/ui'
import { formatPrice } from '../domain/catalog'
import { useOrders } from '../state/OrderContext'
import { useUI } from '../state/UIContext'
import { useWishlist } from '../state/WishlistContext'

export function AccountPage() {
  const { orders } = useOrders()
  const { items: wishlist } = useWishlist()
  const { setWishlistOpen } = useUI()

  return (
    <section className="section" style={{ paddingTop: 44 }}>
      <div className="container">
        <p className="eyebrow">My LumaWear</p>
        <h1 className="section-title" style={{ marginBottom: 28 }}>
          Tài khoản thành viên
        </h1>

        <div className="account-hero">
          <div className="account-identity">
            <div className="account-avatar">L</div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  margin: '0 0 4px',
                }}
              >
                Khách hàng LumaWear
              </h2>
              <p
                style={{
                  margin: 0,
                  color: 'var(--color-text-muted)',
                  fontSize: 13,
                }}
              >
                Hạng thành viên Editorial · Ưu đãi mã LUMA10 (-10%)
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWishlistOpen(true)}
          >
            Danh sách yêu thích ({wishlist.length})
          </Button>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            marginBottom: 18,
          }}
        >
          Lịch sử đơn hàng ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <EmptyState
            title="Bạn chưa có đơn hàng nào"
            description="Các đơn hàng bạn đặt sẽ được lưu tự động tại đây."
            action={<Button to="/products">Bắt đầu mua sắm</Button>}
          />
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order.code}>
              <div className="order-card__top">
                <div>
                  <strong>{order.code}</strong>
                  <span
                    style={{
                      marginLeft: 12,
                      color: 'var(--color-text-muted)',
                      fontSize: 12.5,
                    }}
                  >
                    Ngày đặt: {order.date}
                  </span>
                </div>
                <Badge tone="subtle">{order.status}</Badge>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  fontSize: 13.5,
                }}
              >
                <span style={{ color: 'var(--color-text-muted)' }}>
                  Phương thức:{' '}
                  {order.paymentMethod === 'QR'
                    ? 'Chuyển khoản VietQR'
                    : 'COD'}
                  {order.items?.length
                    ? ` · ${order.items.length} dòng sản phẩm`
                    : ''}
                </span>
                <strong style={{ fontSize: 16 }}>
                  {formatPrice(order.total)}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
