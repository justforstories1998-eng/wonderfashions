import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  Heart, 
  User,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { categories, setFilters } = useProducts();
  const { settings } = useSettings();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters({ searchQuery: searchQuery.trim() });
      navigate('/shop');
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    setFilters({ category: categoryName });
    navigate('/shop');
    setIsCategoryOpen(false);
  };

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Sale', path: '/shop?filter=sale' }
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${isScrolled 
            ? 'bg-white shadow-md py-2' 
            : 'bg-white/95 backdrop-blur-sm py-4'
          }
        `}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2"
            >
              {settings.branding?.logo ? (
                <img 
                  src={settings.branding.logo} 
                  alt={settings.storeName} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {settings.branding?.fallbackText?.[0] || 'W'}
                  </span>
                </div>
              )}
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold text-secondary-900 leading-none">
                  {settings.branding?.fallbackText || 'Wonder'}
                </h1>
                {settings.branding?.subText && (
                  <p className="text-xs text-primary-600 font-medium">
                    {settings.branding.subText}
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`
                    text-sm font-medium transition-colors duration-300
                    ${location.pathname === link.path
                      ? 'text-primary-600'
                      : 'text-secondary-700 hover:text-primary-600'
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-300"
                >
                  Categories
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-secondary-100 py-2 animate-slide-down">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-300"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-300"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden sm:flex p-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-300"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-300"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Admin Link */}
              <Link
                to="/admin"
                className="hidden sm:flex p-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-300"
                aria-label="Admin"
              >
                <User size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-300"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="mt-4 animate-slide-down">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pl-12 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <Search 
                  size={20} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" 
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  <X size={20} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-secondary-100 animate-slide-down">
            <div className="container-custom py-4">
              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300
                      ${location.pathname === link.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="border-t border-secondary-100 mt-2 pt-2">
                  <p className="px-4 py-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.name)}
                      className="w-full text-left px-4 py-3 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-300"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Admin Link */}
                <div className="border-t border-secondary-100 mt-2 pt-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-300"
                  >
                    <User size={18} />
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for dropdowns */}
      {(isCategoryOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:bg-transparent"
          onClick={() => {
            setIsCategoryOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;