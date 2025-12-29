import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';

const Hero = ({ previewData }) => {
  const { getHomeDesign, loading } = useSettings();
  const { getCountryCode } = useCountry();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    // If previewData is provided (from Admin), use it
    if (previewData) {
      setSlides(previewData);
      return;
    }

    // Otherwise load from settings (Customer view)
    if (!loading) {
      const countryCode = getCountryCode() || 'uk';
      const design = getHomeDesign(countryCode);
      const activeSlides = (design.heroSlides || []).filter(s => s.enabled !== false);
      
      if (activeSlides.length === 0) {
        setSlides([{
          id: 'default',
          title: 'Welcome',
          heading: 'Wonder Fashions',
          description: 'New collection available now.',
          buttonText: 'Shop Now',
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
          align: 'left'
        }]);
      } else {
        setSlides(activeSlides.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
    }
  }, [loading, getCountryCode, getHomeDesign, previewData]);

  // ... (Keep existing auto-slide and navigation logic) ...
  // Copy the useEffect for interval, goToSlide, goToPrevSlide, goToNextSlide from previous version
  
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  if (!previewData && loading) return <div className="h-[600px] bg-secondary-100 animate-pulse" />;

  return (
    <section className="relative h-screen min-h-[500px] max-h-[800px] overflow-hidden bg-secondary-900 group">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className="absolute inset-0">
            {slide.image && (
              <img src={slide.image} alt={slide.heading} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>

          <div className="relative h-full container-custom flex items-center">
            <div className={`flex flex-col max-w-xl w-full ${alignmentClasses[slide.align || 'left']} ${slide.align === 'right' ? 'ml-auto' : ''} ${slide.align === 'center' ? 'mx-auto' : ''}`}>
              {slide.subtitle && (
                <span className="inline-block text-primary-400 font-semibold tracking-widest uppercase text-sm mb-2">
                  {slide.subtitle}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                {slide.heading}
              </h1>
              {slide.description && (
                <p className="text-secondary-200 text-lg mb-8 max-w-md">
                  {slide.description}
                </p>
              )}
              {/* Only show button if not in preview mode or if we want it clickable */}
              <div className={previewData ? 'pointer-events-none' : ''}>
                <Link to={slide.buttonLink || '/shop'}>
                  <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
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
          <button onClick={goToPrevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronLeft size={24} />
          </button>
          <button onClick={goToNextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </section>
  );
};

export const MiniHero = ({ title, subtitle, backgroundImage, breadcrumbs = [] }) => {
  return (
    <section className="relative h-64 md:h-80 overflow-hidden bg-secondary-900">
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img src={backgroundImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-800" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative h-full container-custom flex flex-col items-center justify-center text-center">
        {breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.path ? <Link to={crumb.path} className="hover:text-white">{crumb.name}</Link> : <span className="text-white">{crumb.name}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">{title}</h1>
        {subtitle && <p className="text-lg text-white/80 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default Hero;