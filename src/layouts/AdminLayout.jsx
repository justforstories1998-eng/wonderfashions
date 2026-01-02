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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFCF0]">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-[#4A0404] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/admin/login') {
    return (
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F8F0] overflow-hidden font-sans">
      <ToastProvider position="top-right">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1 w-0 overflow-hidden lg:ml-64 transition-all duration-500">
          <AdminHeader onSidebarOpen={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-10 hide-scrollbar bg-mandala">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
          </main>
        </div>
      </ToastProvider>
    </div>
  );
};

export default AdminLayout;