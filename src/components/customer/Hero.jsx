import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';

/**
 * Main Hero Slider Component
 * Used on the Homepage
 */
const Hero = ({ previewData }) => {
  const { getHomeDesign, loading } = useSettings();
  const { getCountryCode } = useCountry();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    // 1. If admin passes preview data, show it immediately
    if (previewData && previewData.length > 0) {
      setSlides(previewData);
      return;
    }

    // 2. Otherwise load from settings for customers
    if (!loading) {
      const code = getCountryCode() || 'uk';
      const design = getHomeDesign(code);
      const active = (design.heroSlides || []).filter(s => s.enabled !== false);
      
      if (active.length === 0) {
        // Fallback slide if nothing is configured
        setSlides([{ 
            id: 'def', 
            heading: 'Welcome to Wonder Fashions', 
            description: 'Posh but affordable traditional wear',
            buttonText: 'Shop Collection', 
            image: 'https://images.unsplash.com/photo-1583391733958-e02376e9ced3?w=1200' 
        }]);
      } else {
        setSlides(active.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    }
  }, [loading, getCountryCode, getHomeDesign, previewData]);

  // Auto-slide logic
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  if (!previewData && loading) return <div className="h-[500px] bg-primary-950 animate-pulse" />;

  return (
    <section className="relative h-screen min-h-[500px] max-h-[800px] overflow-hidden bg-primary-950">
      {slides.map((slide, index) => (
        <div key={slide.id || index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="absolute inset-0">
            {slide.image && <img src={slide.image} className="w-full h-full object-cover" alt="" />}
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative h-full container-custom flex items-center justify-center text-center">
            <div className="max-w-2xl text-white space-y-6">
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-wide drop-shadow-2xl animate-fade-in">
                    {slide.heading}
                </h1>
                <p className="text-lg md:text-xl text-secondary-100 italic font-light tracking-wide">
                    {slide.description}
                </p>
                <div className="pt-6">
                    <Link to={slide.buttonLink || '/shop'}>
                        <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right" className="bg-secondary-500 text-primary-950 border-none px-10 shadow-2xl hover:bg-secondary-400">
                            {slide.buttonText || 'Shop Now'}
                        </Button>
                    </Link>
                </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
            <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all">
                <ChevronLeft size={24} />
            </button>
            <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all">
                <ChevronRight size={24} />
            </button>
        </>
      )}
    </section>
  );
};

/**
 * MiniHero Component (NAMED EXPORT)
 * Used for sub-pages like Shop, Cart, etc.
 */
export const MiniHero = ({ title, subtitle, backgroundImage, breadcrumbs = [] }) => {
  return (
    <section className="relative h-64 md:h-80 overflow-hidden bg-primary-950 border-b-4 border-secondary-600">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img src={backgroundImage} alt={title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-950 opacity-80" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full container-custom flex flex-col items-center justify-center text-center z-10">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-white transition-colors">{crumb.name}</Link>
                  ) : (
                    <span className="text-secondary-100 font-bold">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 tracking-wide drop-shadow-lg">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm md:text-lg text-secondary-200/80 max-w-2xl font-light italic">
            {subtitle}
          </p>
        )}
      </div>
      
      {/* Decorative Mandala corner */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
    </section>
  );
};

export default Hero;