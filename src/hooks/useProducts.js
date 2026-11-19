import { useEffect, useState } from 'react'
import { productRepository } from '../services/productRepository'

export function useProducts() {
  const [products, setProducts] = useState(() => productRepository.getFallback())

  useEffect(() => {
    let mounted = true
    productRepository.findAll().then((items) => {
      if (mounted && items.length > 0) {
        setProducts(items)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  return products
}
