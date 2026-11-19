import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { useProducts } from './hooks/useProducts'
import { AccountPage } from './pages/AccountPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductsPage } from './pages/ProductsPage'

export function App() {
  const products = useProducts()

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage products={products} />} />
        <Route path="/products" element={<ProductsPage products={products} />} />
        <Route
          path="/product/:id"
          element={<ProductDetailPage products={products} />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </MainLayout>
  )
}
