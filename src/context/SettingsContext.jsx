import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialSettings, socialMediaPlatforms } from '../data/settings';

// Initial state
const initialState = {
  settings: initialSettings,
  loading: false,
  error: null
};

// Action types
const SETTINGS_ACTIONS = {
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_SOCIAL_MEDIA: 'UPDATE_SOCIAL_MEDIA',
  UPDATE_STORE_INFO: 'UPDATE_STORE_INFO',
  UPDATE_SHIPPING: 'UPDATE_SHIPPING',
  UPDATE_BRANDING: 'UPDATE_BRANDING',
  RESET_SETTINGS: 'RESET_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const settingsReducer = (state, action) => {
  switch (action.type) {
    case SETTINGS_ACTIONS.LOAD_SETTINGS: {
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    }

    case SETTINGS_ACTIONS.UPDATE_SETTINGS: {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    }

    case SETTINGS_ACTIONS.UPDATE_SOCIAL_MEDIA: {
      return {
        ...state,
        settings: {
          ...state.settings,
          socialMedia: {
            ...state.settings.socialMedia,
            ...action.payload
          }
        }
      };
    }

    case SETTINGS_ACTIONS.UPDATE_STORE_INFO: {
      return {
        ...state,
        settings: {
          ...state.settings,
          storeName: action.payload.storeName || state.settings.storeName,
          storeEmail: action.payload.storeEmail || state.settings.storeEmail,
          storePhone: action.payload.storePhone || state.settings.storePhone,
          storeAddress: action.payload.storeAddress || state.settings.storeAddress
        }
      };
    }

    case SETTINGS_ACTIONS.UPDATE_SHIPPING: {
      return {
        ...state,
        settings: {
          ...state.settings,
          shipping: {
            ...state.settings.shipping,
            ...action.payload
          }
        }
      };
    }

    case SETTINGS_ACTIONS.UPDATE_BRANDING: {
      return {
        ...state,
        settings: {
          ...state.settings,
          branding: {
            ...state.settings.branding,
            ...action.payload
          }
        }
      };
    }

    case SETTINGS_ACTIONS.RESET_SETTINGS: {
      return {
        ...state,
        settings: initialSettings
      };
    }

    case SETTINGS_ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }

    case SETTINGS_ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    default:
      return state;
  }
};

// Create context
const SettingsContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
  const [savedSettings, setSavedSettings] = useLocalStorage(
    'wonderfashions_settings',
    initialSettings
  );
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: true });
    try {
      // Merge saved settings with initial settings to handle new fields
      const mergedSettings = {
        ...initialSettings,
        ...savedSettings,
        branding: {
          ...initialSettings.branding,
          ...savedSettings.branding
        },
        socialMedia: {
          ...initialSettings.socialMedia,
          ...savedSettings.socialMedia
        }
      };
      dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: mergedSettings });
    } catch (error) {
      dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (state.settings) {
      setSavedSettings(state.settings);
    }
  }, [state.settings, setSavedSettings]);

  // Action functions
  const updateSettings = (newSettings) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SETTINGS, payload: newSettings });
  };

  const updateSocialMedia = (socialMediaSettings) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SOCIAL_MEDIA, payload: socialMediaSettings });
  };

  const updateSingleSocialMedia = (platform, data) => {
    dispatch({
      type: SETTINGS_ACTIONS.UPDATE_SOCIAL_MEDIA,
      payload: {
        [platform]: {
          ...state.settings.socialMedia[platform],
          ...data
        }
      }
    });
  };

  const updateStoreInfo = (storeInfo) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_STORE_INFO, payload: storeInfo });
  };

  const updateShipping = (shippingSettings) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SHIPPING, payload: shippingSettings });
  };

  const updateBranding = (brandingSettings) => {
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_BRANDING, payload: brandingSettings });
  };

  const resetSettings = () => {
    dispatch({ type: SETTINGS_ACTIONS.RESET_SETTINGS });
  };

  // Getters
  const getSocialMediaLinks = () => {
    const { socialMedia } = state.settings;
    return Object.entries(socialMedia)
      .filter(([_, data]) => data.enabled && data.url)
      .map(([platform, data]) => ({
        platform,
        ...data,
        ...socialMediaPlatforms.find(p => p.id === platform)
      }));
  };

  const getCurrency = () => {
    return state.settings.currency;
  };

  const formatPrice = (amount) => {
    const { symbol } = state.settings.currency;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const getShippingCost = (subtotal) => {
    const { freeShippingThreshold, standardShippingCost } = state.settings.shipping;
    return subtotal >= freeShippingThreshold ? 0 : standardShippingCost;
  };

  const getTaxRate = () => {
    return state.settings.tax.rate;
  };

  const getTaxName = () => {
    return state.settings.tax.name;
  };

  const value = {
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    socialMediaPlatforms,
    updateSettings,
    updateSocialMedia,
    updateSingleSocialMedia,
    updateStoreInfo,
    updateShipping,
    updateBranding,
    resetSettings,
    getSocialMediaLinks,
    getCurrency,
    formatPrice,
    getShippingCost,
    getTaxRate,
    getTaxName
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;