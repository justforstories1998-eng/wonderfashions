import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Menu, X, Search, User, Heart, 
  ChevronDown, ChevronRight, Globe, Clock, Home 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const { totalItems } = useCart();
  const { categories, setFilters, getCountryProducts } = useProducts();
  const { settings } = useSettings();
  const { selectedCountry, changeCountry, getAvailableCountries } = useCountry();
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const products = getCountryProducts();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, getCountryProducts]);

  const handleCategoryClick = (categorySlug, subcategorySlug = null) => {
    const filterSlug = subcategorySlug || categorySlug;
    setFilters({ category: filterSlug });
    navigate(`/shop?category=${filterSlug}`);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      
      {/* 1. TOP UTILITY BAR (Black) */}
      <div className="bg-black text-[#C5A059] py-2 border-b border-[#C5A059]/20">
        <div className="container-custom flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
          
          {/* Left: Country Switcher */}
          <div className="relative group cursor-pointer flex items-center gap-2">
            <Globe size={12} />
            <span className="text-[#FDFCF0]">{selectedCountry?.flag} {selectedCountry?.name}</span>
            <ChevronDown size={10} />
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#0D0D0D] shadow-2xl rounded-lg border border-[#C5A059]/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-[120]">
              {getAvailableCountries().map(c => (
                <button key={c.code} onClick={() => changeCountry(c.code)} className="w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:bg-[#C5A059] hover:text-black">
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Announcement */}
          <div className="hidden lg:block text-white/40 italic">{settings.header?.announcement}</div>

          {/* Right: History & Admin */}
          <div className="flex items-center gap-6">
            <Link to="/order-history" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
              <Clock size={12}/> <span>Order History</span>
            </Link>
            <Link to="/admin" className="flex items-center gap-1.5 bg-[#C5A059] text-black px-3 py-1 rounded font-black hover:bg-white transition-all">
              <User size={12}/> <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION (Dark Red) */}
      <nav className={`bg-[#1A0505] text-[#FDFCF0] transition-all duration-500 border-b border-[#C5A059]/10 ${isScrolled ? 'py-2' : 'py-5'}`}>
        <div className="container-custom flex items-center justify-between">
          
          {/* Logo & Home Button */}
          <Link to="/" className="flex items-center gap-4 group">
            {settings.branding?.logo ? (
              <img src={settings.branding.logo} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-10 h-10 bg-[#C5A059] rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[#1A0505] font-display font-bold text-xl">{settings.branding?.fallbackText?.[0] || 'W'}</span>
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-display font-bold text-white leading-none tracking-wider uppercase">
                {settings.branding?.fallbackText || 'WONDER'}
              </h1>
              <span className="text-[9px] text-[#C5A059] font-black tracking-[0.4em] uppercase">
                {settings.branding?.subText || 'FASHIONS'}
              </span>
            </div>
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden lg:block flex-1 max-w-md mx-10 relative">
             <div className="relative">
                <input 
                  type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Royal Collections..." 
                  className="w-full bg-black/40 border border-[#C5A059]/40 text-white rounded-full py-2 px-10 text-xs focus:border-[#C5A059] outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]" size={16} />
             </div>
             {searchTerm.length > 1 && (
               <div className="absolute top-full left-0 right-0 mt-3 bg-[#1A1A1A] border border-[#C5A059]/30 rounded-2xl shadow-2xl overflow-hidden z-[130]">
                  {searchResults.length > 0 ? (
                    searchResults.map(p => (
                      <button key={p.id} onClick={() => { navigate(`/product/${p.id}`); setSearchTerm(''); }} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 text-left border-b border-white/5 last:border-0 transition-colors">
                         <img src={p.image} className="w-10 h-10 object-cover rounded" alt="" />
                         <span className="text-xs font-bold text-white uppercase">{p.name}</span>
                      </button>
                    ))
                  ) : <div className="p-10 text-center text-xs text-gray-500 uppercase">Not available</div>}
               </div>
             )}
          </div>

          {/* Cart & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-[#C5A059] hover:scale-110 transition-transform">
              <ShoppingBag size={28} />
              {totalItems > 0 && <span className="absolute top-1 right-1 bg-white text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#1A0505]">{totalItems}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden text-[#C5A059] p-2"><Menu size={28} /></button>
          </div>
        </div>
      </nav>

      {/* 3. CATEGORY STRIP (White) */}
      <div className={`hidden lg:flex justify-center bg-white shadow-md transition-all duration-500 overflow-visible ${isScrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'}`}>
        <div className="flex items-center gap-10">
            <Link to="/" className="text-[11px] font-bold uppercase text-gray-800 hover:text-primary-800 flex items-center gap-1">
                <Home size={12}/> Home
            </Link>
            {categories?.map((cat) => (
                <div key={cat.id} className="relative h-full flex items-center" onMouseEnter={() => setActiveDropdown(cat.id)} onMouseLeave={() => setActiveDropdown(null)}>
                    <button onClick={() => handleCategoryClick(cat.slug)} className={`text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-1 py-1 border-b-2 ${activeDropdown === cat.id ? 'text-black border-[#C5A059]' : 'text-gray-500 border-transparent'}`}>
                        {cat.name} {cat.subcategories?.length > 0 && <ChevronDown size={12} />}
                    </button>
                    {cat.subcategories?.length > 0 && activeDropdown === cat.id && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-2xl border border-gray-100 rounded-b-2xl py-4 z-[200]">
                            <div className="flex flex-col">
                                <button onClick={() => handleCategoryClick(cat.slug)} className="px-6 py-2 text-[10px] font-black text-primary-800 hover:bg-gray-50 text-left uppercase border-b border-gray-50 mb-2">View All {cat.name}</button>
                                {cat.subcategories.map(sub => (
                                    <button key={sub.id} onClick={() => handleCategoryClick(cat.slug, sub.slug)} className="px-6 py-2.5 text-[11px] font-medium text-gray-500 hover:text-black hover:bg-gray-50 text-left transition-colors flex items-center justify-between group">{sub.name} <ChevronRight size={10}/></button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMenuOpen(false)}>
        <div className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-[#FDFCF0] shadow-2xl transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
           <div className="p-8 flex justify-between items-center border-b">
              <span className="font-display font-bold text-[#4A0404] text-xl tracking-tighter">WONDER</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={32}/></button>
           </div>
           <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
              <Link to="/" className="block text-lg font-display font-bold text-[#4A0404]">Home</Link>
              <Link to="/order-history" className="block text-lg font-display font-bold text-[#4A0404]">My Orders</Link>
              <Link to="/admin" className="block text-lg font-display font-bold text-primary-700">Admin Dashboard</Link>
              <div className="h-px bg-gray-200 w-full" />
              {categories.map(cat => (
                  <div key={cat.id} className="space-y-4">
                      <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">{cat.name}</p>
                      <div className="pl-4 space-y-4 border-l border-gray-100">
                          {cat.subcategories?.map(sub => (
                              <Link key={sub.id} to={`/shop?category=${sub.slug}`} onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-600">{sub.name}</Link>
                          ))}
                      </div>
                  </div>
              ))}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;