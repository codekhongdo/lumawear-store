import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../domain/catalog'
import { useCart } from '../../state/CartContext'
import { useUI } from '../../state/UIContext'
import { useWishlist } from '../../state/WishlistContext'
import { Button, Drawer, EmptyState } from '../ui'

export function WishlistDrawer() {
  const { items, toggleWishlist } = useWishlist()
  const { addItem } = useCart()
  const { wishlistOpen, setWishlistOpen } = useUI()

  return (
    <Drawer
      open={wishlistOpen}
      onClose={() => setWishlistOpen(false)}
      title={`Yêu thích (${items.length})`}
    >
      {items.length === 0 ? (
        <EmptyState
          compact
          title="Chưa có sản phẩm yêu thích"
          description="Nhấn biểu tượng trái tim trên sản phẩm để lưu lại xem sau."
        />
      ) : (
        items.map((item) => (
          <div className="cart-item-row" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-thumb" />
            <div>
              <h4 className="cart-item-title">
                <Link
                  to={`/product/${item.id}`}
                  onClick={() => setWishlistOpen(false)}
                >
                  {item.name}
                </Link>
              </h4>
              <div style={{ fontWeight: 600, margin: '4px 0 10px' }}>
                {formatPrice(item.price)}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  addItem(item)
                  setWishlistOpen(false)
                }}
              >
                + Thêm vào giỏ
              </Button>
            </div>
            <button
              type="button"
              className="remove-link"
              onClick={() => toggleWishlist(item)}
            >
              Bỏ lưu
            </button>
          </div>
        ))
      )}
    </Drawer>
  )
}
