import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Music,
  Image,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Footer = () => {
  const { settings, getSocialMediaLinks } = useSettings();
  const currentYear = new Date().getFullYear();

  // Get active social media links
  const activeSocialLinks = getSocialMediaLinks();

  // Icon mapping for social media
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music,
    pinterest: Image,
    linkedin: Linkedin
  };

  // Footer links data
  const shopLinks = [
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Best Sellers', path: '/shop?filter=bestsellers' },
    { name: 'Sale', path: '/shop?filter=sale' },
    { name: 'All Products', path: '/shop' }
  ];

  const categoryLinks = [
    { name: 'Dresses', path: '/shop?category=dresses' },
    { name: 'Tops', path: '/shop?category=tops' },
    { name: 'Jeans', path: '/shop?category=jeans' },
    { name: 'Accessories', path: '/shop?category=accessories' }
  ];

  const supportLinks = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Returns', path: '/returns' },
    { name: 'Size Guide', path: '/size-guide' }
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: `On orders over £${settings.shipping?.freeShippingThreshold || 100}` },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30 day return policy' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: CreditCard, title: 'Flexible Payment', desc: 'Multiple options' }
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Features Section */}
      <div className="border-b border-secondary-800">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-secondary-400">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">
                  {settings.storeName || 'Wonder'}
                </h1>
                <p className="text-xs text-primary-400 -mt-1 font-medium">
                  Fashions
                </p>
              </div>
            </Link>
            
            <p className="text-secondary-400 mb-6 max-w-sm">
              Your one-stop destination for trendy and affordable fashion. 
              Discover the latest styles and express your unique personality.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href={`mailto:${settings.storeEmail || 'hello@wonderfashions.com'}`}
                className="flex items-center gap-3 text-secondary-400 hover:text-primary-400 transition-colors duration-300"
              >
                <Mail size={18} />
                <span>{settings.storeEmail || 'hello@wonderfashions.com'}</span>
              </a>
              <a 
                href={`tel:${settings.storePhone || '+44 (0) 20 1234 5678'}`}
                className="flex items-center gap-3 text-secondary-400 hover:text-primary-400 transition-colors duration-300"
              >
                <Phone size={18} />
                <span>{settings.storePhone || '+44 (0) 20 1234 5678'}</span>
              </a>
              <div className="flex items-start gap-3 text-secondary-400">
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span>
                  {settings.storeAddress?.street || '123 Fashion Street'}, {settings.storeAddress?.city || 'London'}, {settings.storeAddress?.postcode || 'W1A 1AA'}
                </span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-primary-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-primary-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-primary-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
            <p className="text-secondary-400 mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-secondary-800 border border-secondary-700 rounded-lg text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors duration-300"
              >
                Subscribe
                <Send size={18} />
              </button>
            </form>

            {/* Social Links - Dynamic */}
            {activeSocialLinks.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-white">Follow Us</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {activeSocialLinks.map((social) => {
                    const IconComponent = socialIcons[social.platform];
                    return (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-secondary-800 hover:bg-primary-600 rounded-full flex items-center justify-center text-secondary-400 hover:text-white transition-all duration-300"
                        aria-label={social.name}
                        title={social.name}
                      >
                        {IconComponent && <IconComponent size={18} />}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-secondary-400 text-sm text-center md:text-left">
              © {currentYear} {settings.storeName || 'Wonder Fashions'}. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-secondary-500 text-sm">We accept:</span>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-red-500">MC</span>
                </div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">AMEX</span>
                </div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-500">PP</span>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4">
              {companyLinks.slice(2).map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    to={link.path}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                  {index < companyLinks.slice(2).length - 1 && (
                    <span className="text-secondary-700">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;