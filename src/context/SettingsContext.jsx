import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { initialSettings, socialMediaPlatforms } from '../data/settings';

// Initial state
const initialState = {
  settings: initialSettings,
  loading: true,
  saving: false,
  error: null,
  lastSaved: null
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
  SET_SAVING: 'SET_SAVING',
  SET_ERROR: 'SET_ERROR',
  SET_LAST_SAVED: 'SET_LAST_SAVED'
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

    case SETTINGS_ACTIONS.SET_SAVING: {
      return {
        ...state,
        saving: action.payload
      };
    }

    case SETTINGS_ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        loading: false,
        saving: false
      };
    }

    case SETTINGS_ACTIONS.SET_LAST_SAVED: {
      return {
        ...state,
        lastSaved: action.payload
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
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch settings from public/settings.json on mount
  useEffect(() => {
    const fetchSettings = async () => {
      dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: true });
      
      try {
        // Add cache-busting query parameter
        const response = await fetch(`/settings.json?t=${Date.now()}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Merge with initial settings to handle any new fields
          const mergedSettings = {
            ...initialSettings,
            ...data,
            branding: {
              ...initialSettings.branding,
              ...data.branding
            },
            socialMedia: {
              ...initialSettings.socialMedia,
              ...data.socialMedia
            },
            shipping: {
              ...initialSettings.shipping,
              ...data.shipping
            },
            tax: {
              ...initialSettings.tax,
              ...data.tax
            },
            storeAddress: {
              ...initialSettings.storeAddress,
              ...data.storeAddress
            }
          };
          
          dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: mergedSettings });
        } else {
          // If fetch fails, use initial settings
          console.warn('Could not fetch settings, using defaults');
          dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: initialSettings });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: initialSettings });
      } finally {
        setIsInitialized(true);
      }
    };

    fetchSettings();
  }, []);

  // Save settings to GitHub via Netlify function
  const saveSettingsToServer = async (settingsToSave) => {
    dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: true });
    dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: null });

    try {
      const response = await fetch('/api/update-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save settings');
      }

      dispatch({ type: SETTINGS_ACTIONS.SET_LAST_SAVED, payload: new Date().toISOString() });
      dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });

      return { 
        success: true, 
        message: result.message || 'Settings saved! Changes will be live in 1-2 minutes.' 
      };

    } catch (error) {
      console.error('Error saving settings:', error);
      dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });

      return { 
        success: false, 
        message: error.message || 'Failed to save settings' 
      };
    }
  };

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

  // Save all current settings to server
  const saveAllSettings = async () => {
    return await saveSettingsToServer(state.settings);
  };

  // Save specific section and update server
  const saveBrandingToServer = async (brandingData) => {
    const updatedSettings = {
      ...state.settings,
      branding: {
        ...state.settings.branding,
        ...brandingData
      }
    };
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_BRANDING, payload: brandingData });
    return await saveSettingsToServer(updatedSettings);
  };

  const saveStoreInfoToServer = async (storeData) => {
    const updatedSettings = {
      ...state.settings,
      storeName: storeData.storeName || state.settings.storeName,
      storeEmail: storeData.storeEmail || state.settings.storeEmail,
      storePhone: storeData.storePhone || state.settings.storePhone,
      storeAddress: storeData.storeAddress || state.settings.storeAddress
    };
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_STORE_INFO, payload: storeData });
    return await saveSettingsToServer(updatedSettings);
  };

  const saveSocialMediaToServer = async (socialData) => {
    const updatedSettings = {
      ...state.settings,
      socialMedia: {
        ...state.settings.socialMedia,
        ...socialData
      }
    };
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SOCIAL_MEDIA, payload: socialData });
    return await saveSettingsToServer(updatedSettings);
  };

  const saveShippingToServer = async (shippingData) => {
    const updatedSettings = {
      ...state.settings,
      shipping: {
        ...state.settings.shipping,
        ...shippingData
      }
    };
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SHIPPING, payload: shippingData });
    return await saveSettingsToServer(updatedSettings);
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
    saving: state.saving,
    error: state.error,
    lastSaved: state.lastSaved,
    isInitialized,
    socialMediaPlatforms,
    // Local updates (don't save to server)
    updateSettings,
    updateSocialMedia,
    updateSingleSocialMedia,
    updateStoreInfo,
    updateShipping,
    updateBranding,
    resetSettings,
    // Server saves
    saveAllSettings,
    saveBrandingToServer,
    saveStoreInfoToServer,
    saveSocialMediaToServer,
    saveShippingToServer,
    // Getters
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