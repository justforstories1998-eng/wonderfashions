import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { initialSettings, socialMediaPlatforms } from '../data/settings';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [savedSettings, setSavedSettings] = useLocalStorage('wonder_settings_v11', initialSettings);
  const [settings, setSettings] = useState(savedSettings || initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/settings.json?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setSavedSettings(data);
        }
      } catch (e) {
        console.log("Using local settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettingsToServer = async (newSettings) => {
    setSaving(true);
    setSettings(newSettings);
    setSavedSettings(newSettings);

    try {
      if (window.location.hostname === 'localhost') {
        await new Promise(r => setTimeout(r, 500));
        setSaving(false);
        return { success: true };
      }
      const res = await fetch('/api/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      setSaving(false);
      return { success: res.ok };
    } catch (e) {
      setSaving(false);
      return { success: false, message: e.message };
    }
  };

  const value = {
    settings,
    loading,
    saving,
    saveSettingsToServer,
    getHomeDesign: (country) => settings?.homeDesign?.[country] || { heroSlides: [], sections: [] },
    getSocialMediaLinks: () => settings?.socialMediaList?.filter(s => s.enabled && s.url) || [],
    formatPrice: (amount) => `£${Number(amount || 0).toFixed(2)}`
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);