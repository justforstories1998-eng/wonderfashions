import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  PlusCircle, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../common/Modal';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package
    },
    {
      name: 'Add Product',
      path: '/admin/products/add',
      icon: PlusCircle
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCart
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-secondary-200 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-secondary-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="font-display font-bold text-lg text-secondary-900">
              Admin Panel
            </span>
          </div>
          
          {/* Close Button (Mobile) */}
          <button 
            onClick={onClose}
            className="lg:hidden text-secondary-500 hover:text-secondary-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="space-y-1 mb-8">
            <p className="px-4 text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">
              Menu
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()} // Close sidebar on mobile when link clicked
                className={({ isActive }) => `
                  sidebar-link
                  ${isActive ? 'sidebar-link-active' : ''}
                `}
                end={item.path === '/admin/dashboard'}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-4 text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">
              System
            </p>
            
            <NavLink
              to="/admin/settings"
              onClick={() => onClose()}
              className={({ isActive }) => `
                sidebar-link
                ${isActive ? 'sidebar-link-active' : ''}
              `}
            >
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full sidebar-link text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to log out of the admin panel?"
        confirmText="Logout"
      />
    </>
  );
};

export default AdminSidebar;