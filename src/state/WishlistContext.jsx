import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { storageService } from '../services/storageService'
import { useUI } from './UIContext'

const WISHLIST_STORAGE_KEY = 'lumawear-wishlist'
const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { showToast } = useUI()
  const [items, setItems] = useState(() =>
    storageService.read(WISHLIST_STORAGE_KEY, [])
  )

  useEffect(() => {
    storageService.write(WISHLIST_STORAGE_KEY, items)
  }, [items])

  const isWishlisted = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  )

  const toggleWishlist = useCallback(
    (product) => {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === product.id)
        if (exists) {
          showToast(`Đã bỏ "${product.name}" khỏi danh sách yêu thích`)
          return prev.filter((item) => item.id !== product.id)
        }
        showToast(`Đã lưu "${product.name}" vào danh sách yêu thích`)
        return [product, ...prev]
      })
    },
    [showToast]
  )

  const value = useMemo(
    () => ({ items, isWishlisted, toggleWishlist }),
    [items, isWishlisted, toggleWishlist]
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
