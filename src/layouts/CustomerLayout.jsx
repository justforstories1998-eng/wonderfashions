import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { ToastProvider } from '../components/common/Toast';

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-secondary-50">
      {/* Toast Provider wraps the content to show notifications */}
      <ToastProvider position="top-right">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        {/* pt-[72px] adds padding to account for the fixed navbar */}
        <main className="flex-grow pt-[72px]">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </ToastProvider>
    </div>
  );
};

export default CustomerLayout;