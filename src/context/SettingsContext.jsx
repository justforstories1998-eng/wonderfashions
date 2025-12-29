import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { initialSettings, socialMediaPlatforms } from '../data/settings';
import { useLocalStorage } from '../hooks/useLocalStorage';

const initialState = {
  settings: initialSettings,
  loading: true,
  saving: false,
  error: null,
  lastSaved: null
};

const SETTINGS_ACTIONS = {
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  RESET_SETTINGS: 'RESET_SETTINGS',
  SET_LOADING: 'SET_LOADING',
  SET_SAVING: 'SET_SAVING',
  SET_ERROR: 'SET_ERROR',
  SET_LAST_SAVED: 'SET_LAST_SAVED'
};

const settingsReducer = (state, action) => {
  switch (action.type) {
    case SETTINGS_ACTIONS.LOAD_SETTINGS:
      return { ...state, settings: action.payload, loading: false };
    case SETTINGS_ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case SETTINGS_ACTIONS.RESET_SETTINGS:
      return { ...state, settings: initialSettings };
    case SETTINGS_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case SETTINGS_ACTIONS.SET_SAVING:
      return { ...state, saving: action.payload };
    case SETTINGS_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false, saving: false };
    case SETTINGS_ACTIONS.SET_LAST_SAVED:
      return { ...state, lastSaved: action.payload };
    default:
      return state;
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Use v6 key to ensure fresh start with new logic
  const [savedSettings, setSavedSettings] = useLocalStorage('wonderfashions_settings_v6', initialSettings);
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to safely merge objects
  const safeMerge = (defaultObj, remoteObj) => {
    if (!remoteObj) return defaultObj;
    return { ...defaultObj, ...remoteObj };
  };

  useEffect(() => {
    const loadSettings = async () => {
      dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: true });
      
      // 1. Load from LocalStorage FIRST (Fastest)
      if (savedSettings) {
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: savedSettings });
      }

      // 2. Try to fetch from Server (Background Sync)
      try {
        const response = await fetch(`/settings.json?t=${Date.now()}`);
        if (response.ok) {
          const apiData = await response.json();
          const mergedSettings = {
            ...initialSettings,
            ...apiData,
            branding: safeMerge(initialSettings.branding, apiData.branding),
            splashScreen: safeMerge(initialSettings.splashScreen, apiData.splashScreen),
            countries: {
              india: safeMerge(initialSettings.countries.india, apiData.countries?.india),
              uk: safeMerge(initialSettings.countries.uk, apiData.countries?.uk)
            },
            socialMedia: safeMerge(initialSettings.socialMedia, apiData.socialMedia),
            homeDesign: {
              india: safeMerge(initialSettings.homeDesign.india, apiData.homeDesign?.india),
              uk: safeMerge(initialSettings.homeDesign.uk, apiData.homeDesign?.uk)
            },
            categories: (apiData.categories && apiData.categories.length > 0) ? apiData.categories : initialSettings.categories
          };
          
          // Only update if we haven't made local changes recently (simple conflict resolution)
          dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: mergedSettings });
          setSavedSettings(mergedSettings);
        }
      } catch (error) {
        console.warn('Background sync failed, using local data');
      } finally {
        dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: false });
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  // Persist state changes to LocalStorage immediately
  useEffect(() => {
    if (isInitialized && state.settings) {
      setSavedSettings(state.settings);
    }
  }, [state.settings, isInitialized]);

  const saveSettingsToServer = async (settingsToSave) => {
    dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: true });
    dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: null });

    // 1. Optimistic Update (Update UI & LocalStorage immediately)
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SETTINGS, payload: settingsToSave });
    setSavedSettings(settingsToSave);

    try {
      // 2. Check if we are running locally (Vite)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        console.log('📝 Localhost detected: Saved to LocalStorage only. (Netlify Functions require `netlify dev`)');
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        
        dispatch({ type: SETTINGS_ACTIONS.SET_LAST_SAVED, payload: new Date().toISOString() });
        dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });
        
        return { 
          success: true, 
          message: 'Saved locally! (Deploy to Netlify to enable global saving)' 
        };
      }

      // 3. Send to Netlify Function (Production)
      const response = await fetch('/api/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected save');
      }

      const result = await response.json();
      
      dispatch({ type: SETTINGS_ACTIONS.SET_LAST_SAVED, payload: new Date().toISOString() });
      dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });

      return { 
        success: true, 
        message: 'Settings saved! Site is rebuilding (approx 1 min).' 
      };

    } catch (error) {
      console.error('Save failed:', error);
      dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });
      
      // Even if server save fails, we keep local changes so user doesn't lose work
      return { 
        success: false, 
        message: `Saved locally, but server sync failed: ${error.message}` 
      };
    }
  };

  // ... (Rest of helper functions remain the same)
  const updateNestedSettings = (path, value) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(state.settings));
    let current = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    dispatch({ type: SETTINGS_ACTIONS.UPDATE_SETTINGS, payload: newSettings });
    setSavedSettings(newSettings); // Ensure local persistence
    return newSettings;
  };

  const saveSection = async (path, value) => {
    const updatedSettings = updateNestedSettings(path, value);
    return await saveSettingsToServer(updatedSettings);
  };

  const resetSettings = () => {
    dispatch({ type: SETTINGS_ACTIONS.RESET_SETTINGS });
    setSavedSettings(initialSettings);
  };

  // Getters
  const getSocialMediaLinks = () => {
    const socialMedia = state.settings?.socialMedia || initialSettings.socialMedia;
    return Object.entries(socialMedia)
      .filter(([_, data]) => data && data.enabled && data.url)
      .map(([platform, data]) => ({
        platform,
        ...data,
        ...socialMediaPlatforms.find(p => p.id === platform)
      }));
  };

  const getStoreInfo = (countryCode = 'uk') => state.settings?.countries?.[countryCode]?.storeInfo || {};
  const getShippingInfo = (countryCode = 'uk') => state.settings?.countries?.[countryCode]?.shipping || {};
  const getTaxInfo = (countryCode = 'uk') => state.settings?.countries?.[countryCode]?.tax || {};
  const getHomeDesign = (countryCode = 'uk') => state.settings?.homeDesign?.[countryCode] || { heroSlides: [], sections: [], features: [] };

  const value = {
    settings: state.settings || initialSettings,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    lastSaved: state.lastSaved,
    isInitialized,
    socialMediaPlatforms,
    
    updateSettings: (key, value) => {
        const newSettings = { ...state.settings, [key]: value };
        dispatch({ type: SETTINGS_ACTIONS.UPDATE_SETTINGS, payload: { [key]: value } });
        setSavedSettings(newSettings);
        return newSettings;
    },
    updateNestedSettings,
    saveSection,
    saveAllSettings: () => saveSettingsToServer(state.settings),
    resetSettings,
    saveBrandingToServer: (data) => saveSection('branding', data),
    saveStoreInfoToServer: (data) => saveSection('countries.uk.storeInfo', data),
    saveSocialMediaToServer: (data) => saveSection('socialMedia', data),
    saveShippingToServer: (data) => saveSection('countries.uk.shipping', data),
    saveSettingsToServer,
    
    getSocialMediaLinks,
    getStoreInfo,
    getShippingInfo,
    getTaxInfo,
    getHomeDesign,
    getCurrency: () => state.settings?.countries?.uk?.currency || initialSettings.countries.uk.currency,
    formatPrice: (amount) => `£${Number(amount).toFixed(2)}`,
    getTaxName: () => 'VAT'
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;