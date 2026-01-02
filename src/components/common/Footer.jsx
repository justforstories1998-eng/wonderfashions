import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Globe, ArrowUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';

const Footer = () => {
  const { settings, getSocialMediaLinks } = useSettings();
  const { selectedCountry } = useCountry();
  
  const socialLinks = getSocialMediaLinks();
  const storeInfo = settings.countries?.[selectedCountry?.code || 'uk']?.storeInfo || {};

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#1A0A0A] text-[#FDFCF0] font-sans pt-20 pb-10 relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          
          {/* 1. About Us Section */}
          <div className="space-y-6">
            <h4 className="text-[#C5A059] font-display text-2xl font-bold italic tracking-wide">About Us</h4>
            <p className="text-sm text-[#FDFCF0]/60 leading-relaxed font-light">
              {settings.footer?.aboutText || "Wonder Fashions brings royal traditional elegance to the modern woman. Direct from manufacturers to your wardrobe."}
            </p>
            {/* Social Buttons */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 border border-[#C5A059]/30 rounded-full flex items-center justify-center hover:bg-[#C5A059] hover:text-[#1A0A0A] transition-all">
                  <Globe size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Contact Us Section */}
          <div className="space-y-6">
            <h4 className="text-[#C5A059] font-display text-2xl font-bold italic tracking-wide">Contact Us</h4>
            <ul className="space-y-4 text-sm text-[#FDFCF0]/60">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-[#C5A059] flex-shrink-0" />
                <span>{storeInfo.storeAddress?.street || '123 Royal Lane'}, {storeInfo.storeAddress?.city || 'London/Mumbai'}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-[#C5A059] flex-shrink-0" />
                <span>{storeInfo.storePhone || '+44 000 000 000'}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-[#C5A059] flex-shrink-0" />
                <span className="break-all">{storeInfo.storeEmail || 'contact@wonderfashions.com'}</span>
              </li>
            </ul>
          </div>

          {/* 3. Legal Links */}
          <div className="space-y-6">
            <h4 className="text-[#C5A059] font-display text-2xl font-bold italic tracking-wide">Legal</h4>
            <ul className="space-y-4 text-sm text-[#FDFCF0]/60 uppercase tracking-[0.2em] font-bold">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Refund Guarantee</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FDFCF0]/10 pt-10 flex flex-col md:row justify-between items-center gap-6">
          <button onClick={scrollToTop} className="group flex flex-col items-center gap-2">
            <div className="w-10 h-10 border border-[#C5A059] rounded-full flex items-center justify-center group-hover:bg-[#C5A059] transition-all">
              <ArrowUp size={16} className="group-hover:text-[#1A0A0A]" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">Back to top</span>
          </button>
          
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#FDFCF0]/30">
              {settings.footer?.copyrightText || `© ${new Date().getFullYear()} Wonder Fashions`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;