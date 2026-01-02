import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Menu, X, Search, User, Heart, 
  ChevronDown, PackageSearch, Globe, ArrowRight 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchList, setShowSearchList] = useState(false);
  
  const { totalItems } = useCart();
  const { categories, setFilters, getCountryProducts } = useProducts();
  const { settings } = useSettings();
  const { selectedCountry, changeCountry, getAvailableCountries } = useCountry();
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time search logic
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const products = getCountryProducts();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowSearchList(true);
    } else {
      setSearchResults([]);
      setShowSearchList(false);
    }
  }, [searchTerm, getCountryProducts]);

  const handleCategoryClick = (categorySlug, subcategorySlug = null) => {
    const filterSlug = subcategorySlug || categorySlug;
    setFilters({ category: filterSlug });
    navigate(`/shop?category=${filterSlug}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 shadow-2xl">
      
      {/* LAYER 1: TOP BLACK BAR (Region & Contact) */}
      <div className="bg-[#000000] text-[#C5A059] py-2 border-b border-[#C5A059]/20">
        <div className="container-custom flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
          
          {/* Region Switcher */}
          <div className="relative group cursor-pointer flex items-center gap-2">
            <Globe size={12} className="text-[#C5A059]" />
            <span className="text-white/60">Region:</span>
            <span className="flex items-center gap-1 text-[#FDFCF0]">
              {selectedCountry?.flag} {selectedCountry?.name} <ChevronDown size={10} />
            </span>
            <div className="absolute top-full left-0 mt-1 w-44 bg-[#0D0D0D] shadow-2xl rounded-lg border border-[#C5A059]/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-[120]">
              {getAvailableCountries().map(c => (
                <button key={c.code} onClick={() => changeCountry(c.code)} className={`w-full text-left px-5 py-3 text-[10px] uppercase tracking-widest border-b border-white/5 last:border-0 hover:bg-[#C5A059] hover:text-black transition-colors ${selectedCountry?.code === c.code ? 'text-[#C5A059]' : 'text-gray-400'}`}>
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block text-white/50 tracking-[0.3em]">
            {settings.header?.announcement}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/order-history" className="text-white/60 hover:text-white transition-colors">My Orders</Link>
            <Link to="/admin" className="bg-[#C5A059] text-black px-3 py-1 rounded font-black">Admin</Link>
          </div>
        </div>
      </div>

      {/* LAYER 2: BRANDING & SEARCH (Dark Maroon/Charcoal) */}
      <nav className={`bg-[#1A0505] text-[#FDFCF0] transition-all duration-500 border-b border-[#C5A059]/10 ${isScrolled ? 'py-2' : 'py-6'}`}>
        <div className="container-custom flex items-center justify-between">
          
          {/* 1. Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-[#C5A059]">
            <Menu size={28} />
          </button>

          {/* 2. LOGO AREA (Highly Visible) */}
          <Link to="/" className="flex items-center gap-4 group">
            {settings.branding?.logo ? (
              <img src={settings.branding.logo} alt="Logo" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            ) : (
              <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center border-2 border-white shadow-xl">
                <span className="text-[#1A0505] font-display font-bold text-2xl">{settings.branding?.fallbackText?.[0] || 'W'}</span>
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wider leading-none uppercase">
                {settings.branding?.fallbackText || 'WONDER'}
              </h1>
              <span className="text-[10px] text-[#C5A059] font-black tracking-[0.5em] mt-1 uppercase">
                {settings.branding?.subText || 'FASHIONS'}
              </span>
            </div>
          </Link>

          {/* 3. REAL-TIME SEARCH (Spacious) */}
          <div className="hidden lg:block flex-1 max-w-md mx-10 relative" ref={searchRef}>
             <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Saree, Jewelry..." 
                  className="w-full bg-black/40 border border-[#C5A059]/40 text-white rounded-full py-2.5 px-12 text-xs focus:border-[#C5A059] focus:bg-black/60 outline-none transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]" size={16} />
             </div>

             {/* Search Results List */}
             {showSearchList && (
               <div className="absolute top-full left-0 right-0 mt-3 bg-[#1A1A1A] border border-[#C5A059]/30 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-[130]">
                  {searchResults.length > 0 ? (
                    searchResults.map(p => (
                      <button key={p.id} onClick={() => { navigate(`/product/${p.id}`); setShowSearchList(false); setSearchTerm(''); }} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 text-left border-b border-white/5 last:border-0 transition-colors">
                         <img src={p.image} className="w-10 h-10 object-cover rounded-lg border border-[#C5A059]/20" alt="" />
                         <div>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{p.name}</p>
                            <p className="text-[9px] text-[#C5A059] font-bold uppercase">{p.category}</p>
                         </div>
                         <ArrowRight size={14} className="ml-auto text-white/20" />
                      </button>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                        <PackageSearch size={32} className="mx-auto text-gray-700 mb-2" />
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Not available in archives</p>
                    </div>
                  )}
               </div>
             )}
          </div>

          {/* 4. CART ICON */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative p-3 text-[#C5A059] hover:bg-white/5 rounded-full transition-all">
              <ShoppingBag size={28} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-2 right-2 bg-white text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-[#1A0505]">
                    {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* LAYER 3: CATEGORIES MENU (Clean White) */}
      <div className={`hidden lg:flex justify-center bg-white shadow-md border-b border-gray-100 transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0' : 'h-12'}`}>
        <div className="flex items-center gap-10">
            {categories?.map((cat) => (
                <div key={cat.id} className="relative group h-full flex items-center">
                    <button onClick={() => handleCategoryClick(cat.slug)} className="text-[11px] font-bold text-gray-600 hover:text-[#1A0505] uppercase tracking-[0.2em] transition-colors border-b-2 border-transparent hover:border-[#C5A059] py-1">
                        {cat.name}
                    </button>
                    {cat.subcategories?.length > 0 && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                            <div className="bg-white shadow-2xl border border-gray-100 w-52 py-4 rounded-xl flex flex-col z-[150]">
                                {cat.subcategories.map(sub => (
                                    <button key={sub.id} onClick={() => handleCategoryClick(cat.slug, sub.slug)} className="px-6 py-2.5 text-[10px] font-bold text-gray-400 hover:text-black hover:bg-gray-50 text-left uppercase tracking-widest transition-colors">{sub.name}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;