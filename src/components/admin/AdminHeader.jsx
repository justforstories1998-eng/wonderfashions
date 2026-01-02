import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, Bell, Search, User, ChevronDown, LogOut, Settings, Package, ShoppingCart, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onSidebarOpen }) => {
  const { admin, logout } = useAuth();
  const { getOrders } = useOrders();
  const { products } = useProducts();
  const navigate = useNavigate();
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // --- DYNAMIC NOTIFICATION LOGIC ---
  const notifications = useMemo(() => {
    const list = [];
    const allOrders = getOrders();
    const allProducts = [
        ...(products.uk || []),
        ...(products.india || [])
    ];

    // 1. Check for Low Stock / Out of Stock
    allProducts.forEach(p => {
        if (p.stock === 0) {
            list.push({
                id: `stock-out-${p.id}`,
                text: `OUT OF STOCK: ${p.name}`,
                time: "Action required",
                icon: AlertTriangle,
                color: "text-red-600",
                link: `/admin/products/edit/${p.id}`
            });
        } else if (p.stock <= 5) {
            list.push({
                id: `stock-low-${p.id}`,
                text: `Low Stock (${p.stock}): ${p.name}`,
                time: "Inventory Alert",
                icon: Package,
                color: "text-yellow-600",
                link: `/admin/products/edit/${p.id}`
            });
        }
    });

    // 2. Check for Recent Orders (Last 24 Hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    allOrders.forEach(o => {
        if (new Date(o.createdAt) > twentyFourHoursAgo) {
            list.push({
                id: `order-${o.id}`,
                text: `New Order #${o.id} from ${o.customerName}`,
                time: "Recent Activity",
                icon: ShoppingCart,
                color: "text-green-600",
                link: `/admin/orders`
            });
        }
    });

    return list;
  }, [products, getOrders]);

  // --- EVENT HANDLERS ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-secondary-200 h-16 sticky top-0 z-40 px-4 sm:px-6 shadow-sm">
      <div className="flex items-center justify-between h-full">
        
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button onClick={onSidebarOpen} className="p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg lg:hidden"><Menu size={24} /></button>
          <div className="hidden sm:block relative">
            <input type="text" placeholder="Global search..." className="w-64 pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-800" />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`relative p-2 rounded-xl transition-all ${isNotificationOpen ? 'bg-primary-50 text-primary-800' : 'text-secondary-500 hover:bg-secondary-100'}`}
            >
              <Bell size={22} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 text-white text-[8px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                    {notifications.length}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-secondary-200 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
                <div className="p-4 bg-secondary-50 border-b border-secondary-200 flex justify-between items-center">
                  <h3 className="font-bold text-secondary-900 text-sm uppercase tracking-widest">Alert Center</h3>
                  <span className="text-[10px] bg-primary-800 text-white px-2 py-0.5 rounded-full font-bold">{notifications.length} LIVE</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => { navigate(n.link); setIsNotificationOpen(false); }}
                            className="p-4 border-b border-secondary-50 hover:bg-secondary-50 cursor-pointer transition-colors flex gap-3"
                        >
                          <div className={`p-2 rounded-lg bg-gray-50 ${n.color}`}><n.icon size={16}/></div>
                          <div>
                            <p className="text-xs text-secondary-900 font-semibold">{n.text}</p>
                            <p className="text-[10px] text-secondary-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-2">
                        <Info className="mx-auto text-secondary-200" size={32} />
                        <p className="text-sm text-secondary-500">Your store is running smoothly. No new alerts.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-8 bg-secondary-200 mx-1 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-1 pr-3 rounded-full transition-all border ${isProfileOpen ? 'bg-primary-50 border-primary-200 shadow-inner' : 'hover:bg-secondary-50 border-transparent'}`}
            >
              <div className="w-9 h-9 rounded-full bg-primary-800 border-2 border-secondary-200 flex items-center justify-center overflow-hidden text-white shadow-md">
                {admin?.avatar ? <img src={admin.avatar} alt="Admin" className="w-full h-full object-cover" /> : <User size={20} />}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-secondary-900 leading-none">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-secondary-500 mt-1 font-medium">Administrator</p>
              </div>
              <ChevronDown size={14} className={`text-secondary-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-secondary-200 rounded-2xl shadow-2xl overflow-hidden animate-slide-down">
                <div className="p-4 bg-secondary-50 border-b border-secondary-200">
                    <p className="text-[10px] text-secondary-400 font-bold uppercase">Account</p>
                    <p className="text-sm font-bold text-primary-900 truncate">{admin?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button onClick={() => { navigate('/admin/settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors">
                    <Settings size={18} /> <span>Settings</span>
                  </button>
                  <button onClick={() => { navigate('/admin/dashboard'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50 rounded-xl transition-colors">
                    <Package size={18} /> <span>Dashboard</span>
                  </button>
                </div>
                <div className="p-2 border-t border-secondary-100">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-bold">
                    <LogOut size={18} /> <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;