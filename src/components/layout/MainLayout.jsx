import React from 'react'
import { CartDrawer } from '../commerce/CartDrawer'
import { QuickViewModal } from '../commerce/QuickViewModal'
import { WishlistDrawer } from '../commerce/WishlistDrawer'
import { ToastViewport } from '../ui'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'

export function MainLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <ToastViewport />
    </>
  )
}
