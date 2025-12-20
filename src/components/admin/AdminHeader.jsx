import React from 'react';
import { Menu, Bell, Search, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ onSidebarOpen }) => {
  const { admin } = useAuth();

  return (
    <header className="bg-white border-b border-secondary-200 h-16 sticky top-0 z-20 px-4 sm:px-6">
      <div className="flex items-center justify-between h-full">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSidebarOpen}
            className="p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

          {/* Search Bar (Hidden on small mobile) */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-300"
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" 
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="w-px h-8 bg-secondary-200 mx-1"></div>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-1">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-secondary-900 leading-tight">
                {admin?.name || 'Admin User'}
              </p>
              <p className="text-xs text-secondary-500">
                Administrator
              </p>
            </div>
            
            <button className="flex items-center gap-2 focus:outline-none group">
              <div className="w-9 h-9 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center overflow-hidden">
                {admin?.avatar ? (
                  <img 
                    src={admin.avatar} 
                    alt={admin.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-primary-600" />
                )}
              </div>
              <ChevronDown 
                size={16} 
                className="text-secondary-400 group-hover:text-secondary-600 transition-colors hidden sm:block" 
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;