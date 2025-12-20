import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error, clearError, loading } = useAuth();
  const { settings } = useSettings();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error on component mount
  useEffect(() => {
    clearError();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful! Welcome back.');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 hero-pattern" />
        
        {/* Decorative Circles */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative flex flex-col justify-center items-center w-full px-12 text-center">
          {settings.branding?.logo ? (
            <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl p-4 overflow-hidden">
              <img 
                src={settings.branding.logo} 
                alt={settings.storeName} 
                className="w-full h-full object-contain" 
              />
            </div>
          ) : (
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl">
              <span className="text-4xl font-bold text-primary-600">
                {settings.branding?.fallbackText?.[0] || 'W'}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            {settings.storeName || 'Wonder Fashions'}
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Admin Panel - Manage your store, products, and orders from one place.
          </p>

          <div className="flex items-center gap-4 text-white/60 text-sm">
            <span>Products</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>Orders</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>Analytics</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-secondary-50">
        <div className="w-full max-w-md">
          {/* Back to Store */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-secondary-500 hover:text-primary-600 mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Store</span>
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            {settings.branding?.logo ? (
              <div className="w-16 h-16 bg-white border border-secondary-200 rounded-xl flex items-center justify-center overflow-hidden p-2">
                <img 
                  src={settings.branding.logo} 
                  alt={settings.storeName} 
                  className="w-full h-full object-contain" 
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {settings.branding?.fallbackText?.[0] || 'W'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-display font-bold text-secondary-900">
                {settings.storeName || 'Wonder Fashions'}
              </h1>
              <p className="text-xs text-secondary-500">Admin Panel</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-secondary-600">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">
              Email: <code className="bg-blue-100 px-1 rounded">admin@wonderfashions.com</code>
            </p>
            <p className="text-sm text-blue-700">
              Password: <code className="bg-blue-100 px-1 rounded">admin123</code>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail 
                  size={18} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" 
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@wonderfashions.com"
                  className={`input pl-11 ${formErrors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock 
                  size={18} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`input pl-11 pr-11 ${formErrors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-600">Remember me</span>
              </label>
              
              <button 
                type="button" 
                className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-secondary-500 text-sm mt-8">
            &copy; {new Date().getFullYear()} {settings.storeName || 'Wonder Fashions'}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;