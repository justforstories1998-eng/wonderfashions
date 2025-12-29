import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Globe } from 'lucide-react';
import { useCountry } from '../../context/CountryContext';
import { useSettings } from '../../context/SettingsContext';

const CountrySelectPage = () => {
  const navigate = useNavigate();
  const { selectCountry, getAvailableCountries } = useCountry();
  const { settings } = useSettings();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get branding
  const branding = settings?.branding || {};
  const logo = branding.logo;
  const fallbackText = branding.fallbackText || 'Wonder';
  const subText = branding.subText || 'Fashions';

  // Get available countries from settings
  const countriesConfig = settings?.countries || {};
  
  const countries = [
    {
      code: 'india',
      name: 'India',
      flag: '🇮🇳',
      currency: '₹ INR',
      description: 'Shop in Indian Rupees',
      enabled: countriesConfig.india?.enabled !== false
    },
    {
      code: 'uk',
      name: 'United Kingdom',
      flag: '🇬🇧',
      currency: '£ GBP',
      description: 'Shop in British Pounds',
      enabled: countriesConfig.uk?.enabled !== false
    }
  ].filter(c => c.enabled);

  const handleCountrySelect = (countryCode) => {
    setSelectedOption(countryCode);
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    
    setIsAnimating(true);
    
    // Small delay for animation
    setTimeout(() => {
      selectCountry(selectedOption);
      navigate('/');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Decorative Circles */}
      <div className="absolute -left-32 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className={`
        relative flex-1 flex flex-col items-center justify-center px-4 py-12
        transition-all duration-300
        ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}>
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          {logo ? (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center p-4">
              <img
                src={logo}
                alt={fallbackText}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-bold text-primary-600">
                {fallbackText.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Brand Name */}
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
            {fallbackText}
          </h1>
          {subText && (
            <p className="text-lg text-white/80 font-medium">
              {subText}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Globe className="text-white/70" size={24} />
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              Select Your Region
            </h2>
          </div>
          <p className="text-white/70 max-w-md">
            Choose your country to see products and prices in your local currency
          </p>
        </div>

        {/* Country Options */}
        <div className="w-full max-w-lg space-y-4 mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleCountrySelect(country.code)}
              className={`
                w-full p-5 rounded-2xl border-2 transition-all duration-300
                flex items-center gap-4 text-left
                ${selectedOption === country.code
                  ? 'bg-white border-white shadow-xl scale-[1.02]'
                  : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                }
              `}
            >
              {/* Flag */}
              <div className={`
                text-5xl transition-transform duration-300
                ${selectedOption === country.code ? 'scale-110' : ''}
              `}>
                {country.flag}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className={`
                  text-xl font-semibold mb-1 transition-colors duration-300
                  ${selectedOption === country.code ? 'text-secondary-900' : 'text-white'}
                `}>
                  {country.name}
                </h3>
                <p className={`
                  text-sm transition-colors duration-300
                  ${selectedOption === country.code ? 'text-secondary-600' : 'text-white/70'}
                `}>
                  {country.description}
                </p>
              </div>

              {/* Currency Badge */}
              <div className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300
                ${selectedOption === country.code
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white/10 text-white'
                }
              `}>
                {country.currency}
              </div>

              {/* Selection Indicator */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${selectedOption === country.code
                  ? 'border-primary-600 bg-primary-600'
                  : 'border-white/40'
                }
              `}>
                {selectedOption === country.code && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
          <button
            onClick={handleContinue}
            disabled={!selectedOption}
            className={`
              w-full py-4 px-8 rounded-xl font-semibold text-lg
              flex items-center justify-center gap-3
              transition-all duration-300
              ${selectedOption
                ? 'bg-white text-primary-700 hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-[1.02]'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
              }
            `}
          >
            Continue to Store
            <ArrowRight size={22} className={`transition-transform duration-300 ${selectedOption ? 'translate-x-0' : ''}`} />
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-white/50 text-sm text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
          You can change your region later from the menu
        </p>
      </div>

      {/* Footer */}
      <div className="relative py-6 text-center">
        <p className="text-white/40 text-sm">
          © {new Date().getFullYear()} {fallbackText} {subText}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default CountrySelectPage;