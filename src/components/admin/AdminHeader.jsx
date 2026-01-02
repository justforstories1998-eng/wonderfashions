import React from 'react';
import { Menu, Bell, Search, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ onSidebarOpen }) => {
  const { admin } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button onClick={onSidebarOpen} className="lg:hidden p-2 bg-gray-50 rounded-lg text-gray-400"><Menu size={20}/></button>
        <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input type="text" placeholder="Search archives..." className="bg-gray-50 border-transparent border focus:border-[#C5A059]/30 py-2.5 pl-12 pr-4 rounded-full text-xs outline-none w-64 transition-all" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-[#4A0404] transition-colors">
            <Bell size={22} strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#C5A059] rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-100"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
            <div className="text-right">
                <p className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-tighter leading-none">{admin?.name || 'Administrator'}</p>
                <p className="text-[9px] font-bold text-[#C5A059] uppercase mt-1 tracking-widest">Imperial Access</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FDFCF0] border border-[#C5A059]/30 flex items-center justify-center text-[#4A0404] font-black shadow-inner">
                {admin?.name?.[0] || 'A'}
            </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;