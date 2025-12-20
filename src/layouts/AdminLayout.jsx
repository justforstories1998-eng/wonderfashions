import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from '../components/common/Toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If on login page, don't show layout
  if (location.pathname === '/admin/login') {
    return (
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    );
  }

  return (
    <div className="flex h-screen bg-secondary-50 overflow-hidden">
      <ToastProvider position="top-right">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Wrapper */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden lg:ml-64 transition-all duration-300">
          {/* Header */}
          <AdminHeader onSidebarOpen={() => setSidebarOpen(true)} />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </div>
  );
};

export default AdminLayout;