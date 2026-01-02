import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, 
  Settings, LogOut, X, Layout, List
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { settings } = useSettings(); // Use dynamic settings
  const navigate = useNavigate();

  const branding = settings?.branding || {};

  const menu = [
    { title: "Dashboard", items: [{ name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard }] },
    { title: "Storefront", items: [
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Categories', path: '/admin/categories', icon: List }
    ]},
    { title: "Design", items: [{ name: 'Visual Builder', path: '/admin/design', icon: Layout }] }
  ];

  return (
    <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#0D0D0D] border-r border-[#C5A059]/20 transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        {/* Profile Info Area */}
        <div className="p-8 border-b border-white/5 bg-[#141414] flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* DYNAMIC LOGO HERE */}
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#C5A059]/40 shadow-xl overflow-hidden">
                {branding.logo ? (
                  <img src={branding.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-[#4A0404] font-display font-bold text-2xl">{branding.fallbackText?.[0] || 'W'}</span>
                )}
            </div>
            <div>
              <h2 className="text-[#FDFCF0] font-display font-bold text-xl tracking-tight uppercase leading-none">
                {branding.fallbackText || 'WONDER'}
              </h2>
              <span className="text-[9px] font-black text-[#C5A059] tracking-[0.4em] uppercase">Control</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
          {menu.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <p className="px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink 
                    key={item.path} 
                    to={item.path} 
                    className={({ isActive }) => `flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group ${isActive ? 'bg-[#C5A059] text-[#0D0D0D] font-bold' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={18} className={`${isActive ? 'text-[#0D0D0D]' : 'text-[#C5A059]'}`} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Panel */}
        <div className="p-6 bg-[#0D0D0D] border-t border-white/5 flex-shrink-0">
            <button onClick={() => { navigate('/admin/settings'); onClose(); }} className="w-full flex items-center gap-3 px-5 py-3 text-white/40 hover:text-[#C5A059] transition-colors text-[10px] font-black uppercase tracking-widest text-left">
                <Settings size={16} /> Configuration
            </button>
            <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3 text-red-500/60 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest text-left">
                <LogOut size={16} /> Termination
            </button>
        </div>
    </aside>
  );
};

export default AdminSidebar;