import React, { createContext, useContext, useState, useEffect } from 'react';

// Country configurations
const countryConfig = {
  india: {
    code: 'india',
    name: 'India',
    shortCode: 'IN',
    flag: '🇮🇳',
    currency: {
      code: 'INR',
      symbol: '₹',
      name: 'Indian Rupee'
    },
    locale: 'en-IN',
    dateFormat: 'DD/MM/YYYY',
    phonePrefix: '+91'
  },
  uk: {
    code: 'uk',
    name: 'United Kingdom',
    shortCode: 'UK',
    flag: '🇬🇧',
    currency: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound'
    },
    locale: 'en-GB',
    dateFormat: 'DD/MM/YYYY',
    phonePrefix: '+44'
  }
};

// Local storage key
const COUNTRY_STORAGE_KEY = 'wonderfashions_country';

// Create context
const CountryContext = createContext();

// Provider component
export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for saved country on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem(COUNTRY_STORAGE_KEY);
    
    if (savedCountry && countryConfig[savedCountry]) {
      setSelectedCountry(countryConfig[savedCountry]);
      setIsCountrySelected(true);
    }
    
    setLoading(false);
  }, []);

  // Select a country
  const selectCountry = (countryCode) => {
    const country = countryConfig[countryCode];
    
    if (country) {
      setSelectedCountry(country);
      setIsCountrySelected(true);
      localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
      return true;
    }
    
    return false;
  };

  // Change country (allows user to switch)
  const changeCountry = (countryCode) => {
    const country = countryConfig[countryCode];
    
    if (country) {
      setSelectedCountry(country);
      localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
      
      // Reload page to refresh all data for new country
      window.location.href = '/';
      return true;
    }
    
    return false;
  };

  // Reset country selection (for testing or user choice)
  const resetCountrySelection = () => {
    setSelectedCountry(null);
    setIsCountrySelected(false);
    localStorage.removeItem(COUNTRY_STORAGE_KEY);
  };

  // Get country code
  const getCountryCode = () => {
    return selectedCountry?.code || null;
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    return selectedCountry?.currency?.symbol || '£';
  };

  // Format price based on selected country
  const formatPrice = (amount) => {
    if (!selectedCountry) return `£${amount.toFixed(2)}`;
    
    const { symbol } = selectedCountry.currency;
    
    // Format based on country
    if (selectedCountry.code === 'india') {
      // Indian format: ₹1,23,456.00
      return `${symbol}${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else {
      // UK format: £1,234.56
      return `${symbol}${amount.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  // Format date based on selected country
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const locale = selectedCountry?.locale || 'en-GB';
    
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const locale = selectedCountry?.locale || 'en-GB';
    
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if country is India
  const isIndia = () => {
    return selectedCountry?.code === 'india';
  };

  // Check if country is UK
  const isUK = () => {
    return selectedCountry?.code === 'uk';
  };

  // Get all available countries
  const getAvailableCountries = () => {
    return Object.values(countryConfig);
  };

  const value = {
    // State
    selectedCountry,
    isCountrySelected,
    loading,
    
    // Actions
    selectCountry,
    changeCountry,
    resetCountrySelection,
    
    // Getters
    getCountryCode,
    getCurrencySymbol,
    getAvailableCountries,
    
    // Formatters
    formatPrice,
    formatDate,
    formatDateTime,
    
    // Helpers
    isIndia,
    isUK,
    
    // Config
    countryConfig
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};

// Custom hook to use country context
export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export default CountryContext;