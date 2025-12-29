import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useCountry } from './context/CountryContext';
import { useAuth } from './context/AuthContext';
import SplashScreen from './components/common/SplashScreen';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import CountrySelectPage from './pages/customer/CountrySelectPage';
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
import HomeDesignPage from './pages/admin/HomeDesignPage';
import SlidesPage from './pages/admin/SlidesPage';
import CategoryManagerPage from './pages/admin/CategoryManagerPage';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isCountrySelected, loading } = useCountry();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle splash screen logic
  useEffect(() => {
    // Only show splash on root path '/' and if not logged in as admin
    if (location.pathname !== '/' || isAuthenticated) {
      setShowSplash(false);
    }
  }, [location, isAuthenticated]);

  // Handle splash complete
  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!isCountrySelected) {
      navigate('/select-country');
    }
  };

  // Loading state with visual indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Render splash screen if needed (only for non-admin)
  if (showSplash && location.pathname === '/' && !isAuthenticated) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Routes>
      {/* Country Selection */}
      <Route path="/select-country" element={<CountrySelectPage />} />

      {/* Customer Routes */}
      <Route path="/" element={
        !isCountrySelected ? <Navigate to="/select-country" replace /> : <CustomerLayout />
      }>
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
        <Route path="design" element={<HomeDesignPage />} />
        <Route path="slides" element={<SlidesPage />} />
        <Route path="categories" element={<CategoryManagerPage />} />
      </Route>

      {/* Catch All - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;