import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 3000)
  }, [])

  const value = useMemo(
    () => ({
      cartOpen,
      setCartOpen,
      wishlistOpen,
      setWishlistOpen,
      mobileMenuOpen,
      setMobileMenuOpen,
      quickViewProduct,
      setQuickViewProduct,
      toasts,
      showToast,
    }),
    [cartOpen, wishlistOpen, mobileMenuOpen, quickViewProduct, toasts, showToast]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export const useUI = () => useContext(UIContext)
