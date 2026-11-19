import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/tokens.css'
import './styles/base.css'
import './styles/primitives.css'
import './styles/layout.css'
import { App } from './App'
import { StoreProvider } from './state/StoreProvider'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </HashRouter>
)
