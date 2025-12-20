import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Context Providers
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { OrderProvider } from './context/OrderContext'
import { SettingsProvider } from './context/SettingsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)