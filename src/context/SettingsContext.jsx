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
  const [savedSettings, setSavedSettings] = useLocalStorage('wonderfashions_settings_v12', initialSettings);
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // DYNAMIC FAVICON LOGIC
  useEffect(() => {
    const logo = state.settings?.branding?.logo;
    if (logo) {
      const favicon = document.getElementById('dynamic-favicon');
      if (favicon) {
        favicon.href = logo;
      }
    }
    
    // Update Document Title as well
    if (state.settings?.storeName) {
        document.title = state.settings.storeName;
    }
  }, [state.settings?.branding?.logo, state.settings?.storeName]);

  const fetchSettings = async () => {
    dispatch({ type: SETTINGS_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await fetch(`/settings.json?t=${Date.now()}`);
      if (response.ok) {
        const apiData = await response.json();
        if (!apiData.socialMediaList) apiData.socialMediaList = [];
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: apiData });
        setSavedSettings(apiData);
      } else {
        dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: savedSettings || initialSettings });
      }
    } catch (error) {
      dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: savedSettings || initialSettings });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettingsToServer = async (newSettings) => {
    dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: true });
    setSavedSettings(newSettings);
    dispatch({ type: SETTINGS_ACTIONS.LOAD_SETTINGS, payload: newSettings });

    try {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        await new Promise(r => setTimeout(r, 500));
        dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });
        return { success: true };
      }

      const res = await fetch('/api/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error('Sync failed');
      
      dispatch({ type: SETTINGS_ACTIONS.SET_LAST_SAVED, payload: new Date().toISOString() });
      dispatch({ type: SETTINGS_ACTIONS.SET_SAVING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: SETTINGS_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, message: error.message };
    }
  };

  const getSocialMediaLinks = () => {
    const list = state.settings?.socialMediaList || [];
    return list.filter(s => s.enabled && s.url);
  };

  const getHomeDesign = (countryCode = 'uk') => {
    return state.settings?.homeDesign?.[countryCode] || { heroSlides: [], sections: [] };
  };

  const getStoreInfo = (countryCode = 'uk') => {
    return state.settings?.countries?.[countryCode]?.storeInfo || {};
  };

  const value = {
    settings: state.settings,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    lastSaved: state.lastSaved,
    socialMediaPlatforms,
    saveSettingsToServer,
    refreshSettings: fetchSettings,
    getSocialMediaLinks,
    getHomeDesign,
    getStoreInfo,
    formatPrice: (amount) => `£${Number(amount || 0).toFixed(2)}`,
    getTaxName: () => 'VAT'
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;