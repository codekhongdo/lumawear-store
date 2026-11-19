import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CATEGORIES, categoryPath } from '../../domain/catalog'
import { useCart } from '../../state/CartContext'
import { useUI } from '../../state/UIContext'
import { useWishlist } from '../../state/WishlistContext'
import {
  BagIcon,
  Button,
  Drawer,
  HeartIcon,
  IconButton,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from '../ui'

export function Header() {
  const { pricing } = useCart()
  const { items: wishlist } = useWishlist()
  const {
    setCartOpen,
    setWishlistOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useUI()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <IconButton
            className="mobile-menu-trigger"
            aria-label="Mở menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Link to="/" className="brand-logo" aria-label="LumaWear Store">
            <span className="brand-logo__main">LumaWear</span>
            <span className="brand-logo__sub">Editorial Wardrobe</span>
          </Link>

          <nav className="main-nav" aria-label="Điều hướng chính">
            <Link
              to="/"
              className={`main-nav__link${
                location.pathname === '/' ? ' main-nav__link--active' : ''
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className={`main-nav__link${
                location.pathname === '/products' && !location.search
                  ? ' main-nav__link--active'
                  : ''
              }`}
            >
              Bộ sưu tập
            </Link>
            {CATEGORIES.slice(1).map((cat) => (
              <Link key={cat} to={categoryPath(cat)} className="main-nav__link">
                {cat}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm thiết kế..."
                aria-label="Tìm kiếm sản phẩm"
              />
              <button type="submit" aria-label="Tìm kiếm">
                <SearchIcon />
              </button>
            </form>

            <IconButton
              aria-label="Danh sách yêu thích"
              badge={wishlist.length}
              badgeTone="accent"
              onClick={() => setWishlistOpen(true)}
            >
              <HeartIcon />
            </IconButton>

            <IconButton to="/account" aria-label="Tài khoản">
              <UserIcon />
            </IconButton>

            <IconButton
              aria-label="Giỏ hàng"
              badge={pricing.itemCount}
              onClick={() => setCartOpen(true)}
            >
              <BagIcon />
            </IconButton>
          </div>
        </div>
      </header>

      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        title="LumaWear"
        side="left"
      >
        <form
          onSubmit={handleSearch}
          style={{ display: 'flex', gap: 8, marginBottom: 24 }}
        >
          <input
            className="ds-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
          />
          <Button type="submit" size="sm">
            Tìm
          </Button>
        </form>
        <div style={{ display: 'grid', gap: 14, fontSize: 16 }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Trang chủ
          </Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
            Tất cả sản phẩm
          </Link>
          {CATEGORIES.slice(1).map((cat) => (
            <Link
              key={cat}
              to={categoryPath(cat)}
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
          <hr
            style={{
              border: 0,
              borderTop: '1px solid var(--color-border)',
              width: '100%',
            }}
          />
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
            Giỏ hàng ({pricing.itemCount})
          </Link>
          <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
            Tài khoản &amp; Đơn hàng
          </Link>
        </div>
      </Drawer>
    </>
  )
}
