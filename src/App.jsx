import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import ShopPage from './pages/customer/ShopPage';
import ProductDetailPage from './pages/customer/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import AddProductPage from './pages/admin/AddProductPage';
import EditProductPage from './pages/admin/EditProductPage';
import OrdersPage from './pages/admin/OrdersPage';
import SettingsPage from './pages/admin/SettingsPage';

const App = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<OrderSuccessPage />} />
        
        {/* Placeholder routes for footer links */}
        <Route path="wishlist" element={<ShopPage />} />
        <Route path="contact" element={<HomePage />} />
        <Route path="about" element={<HomePage />} />
        <Route path="faqs" element={<HomePage />} />
        <Route path="shipping" element={<HomePage />} />
        <Route path="returns" element={<HomePage />} />
        <Route path="size-guide" element={<HomePage />} />
        <Route path="careers" element={<HomePage />} />
        <Route path="privacy" element={<HomePage />} />
        <Route path="terms" element={<HomePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="login" element={<AdminLoginPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch All - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;