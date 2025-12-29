import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';

const SplashScreen = ({ onComplete }) => {
  const { settings, loading: settingsLoading } = useSettings();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (settingsLoading) return;

    const splashSettings = settings?.splashScreen || {};
    const duration = splashSettings.duration || 3000;
    const enabled = splashSettings.enabled !== false;

    if (!enabled) {
      onComplete();
      return;
    }

    const fadeTimer = setTimeout(() => setIsFading(true), duration - 800);
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [settingsLoading, settings, onComplete]);

  if (!isVisible) return null;

  const branding = settings?.branding || {};
  // Default to a rich maroon if not set
  const backgroundColor = '#771d1d'; // Primary-900
  const logo = branding.logo;
  const fallbackText = branding.fallbackText || 'Wonder';
  const subText = branding.subText || 'Fashions';

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        transition-opacity duration-1000 ease-in-out
        ${isFading ? 'opacity-0' : 'opacity-100'}
      `}
      style={{ backgroundColor }}
    >
      {/* Decorative Mandala Background */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] animate-pulse"></div>

      {/* Decorative Border Frame */}
      <div className="absolute inset-4 border-2 border-secondary-400 opacity-30 rounded-lg pointer-events-none"></div>
      <div className="absolute inset-6 border border-secondary-500 opacity-20 rounded-lg pointer-events-none"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 z-10">
        {/* Logo Container with Gold Glow */}
        <div className={`
          mb-8 transform transition-all duration-1000 ease-out
          ${isFading ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}
        `}>
          {logo ? (
            <div className="w-40 h-40 bg-secondary-50 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.6)] flex items-center justify-center p-6 border-4 border-secondary-600">
              <img
                src={logo}
                alt={fallbackText}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-40 h-40 bg-secondary-50 rounded-full shadow-[0_0_30px_rgba(217,119,6,0.6)] flex items-center justify-center border-4 border-secondary-600">
              <span className="text-6xl font-display font-bold text-primary-900">
                {fallbackText.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-100 tracking-wider drop-shadow-md">
            {fallbackText}
          </h1>
          {subText && (
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-secondary-400"></div>
              <p className="text-xl md:text-2xl text-secondary-200 font-light tracking-[0.2em] uppercase">
                {subText}
              </p>
              <div className="h-px w-8 bg-secondary-400"></div>
            </div>
          )}
        </div>

        {/* Loading Spinner (Gold) */}
        <div className="mt-12">
          <div className="w-12 h-12 border-4 border-secondary-800 border-t-secondary-400 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;