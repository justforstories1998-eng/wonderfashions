import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../common/Button';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const slides = [
    {
      id: 1,
      title: 'Summer Collection',
      subtitle: '2024',
      heading: 'Discover Your Style',
      description: 'Explore our latest summer collection with trendy and comfortable pieces perfect for the season.',
      buttonText: 'Shop Now',
      buttonLink: '/shop?filter=new',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
      align: 'left'
    },
    {
      id: 2,
      title: 'New Arrivals',
      subtitle: 'Fresh Styles',
      heading: 'Be Bold, Be You',
      description: 'Express your unique personality with our exclusive new arrivals. Stand out from the crowd.',
      buttonText: 'Explore Collection',
      buttonLink: '/shop?filter=new',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
      align: 'center'
    },
    {
      id: 3,
      title: 'Special Offer',
      subtitle: 'Up to 50% Off',
      heading: 'Season End Sale',
      description: 'Don\'t miss out on incredible deals. Shop your favorite styles at unbeatable prices.',
      buttonText: 'Shop Sale',
      buttonLink: '/shop?filter=sale',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
      align: 'right'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Alignment classes
  const alignmentClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right'
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`
            absolute inset-0 transition-opacity duration-1000
            ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-custom flex items-center">
            <div 
              className={`
                flex flex-col max-w-xl
                ${alignmentClasses[slide.align]}
                ${slide.align === 'right' ? 'ml-auto' : ''}
                ${slide.align === 'center' ? 'mx-auto' : ''}
              `}
            >
              {/* Subtitle */}
              <span 
                className={`
                  inline-block text-primary-400 font-semibold tracking-widest uppercase text-sm mb-2
                  animate-fade-in
                  ${index === currentSlide ? 'animate-slide-up' : ''}
                `}
                style={{ animationDelay: '0.2s' }}
              >
                {slide.subtitle}
              </span>

              {/* Title */}
              <h2 
                className={`
                  text-white text-lg md:text-xl font-medium mb-4
                  ${index === currentSlide ? 'animate-slide-up' : ''}
                `}
                style={{ animationDelay: '0.3s' }}
              >
                {slide.title}
              </h2>

              {/* Heading */}
              <h1 
                className={`
                  text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight
                  ${index === currentSlide ? 'animate-slide-up' : ''}
                `}
                style={{ animationDelay: '0.4s' }}
              >
                {slide.heading}
              </h1>

              {/* Description */}
              <p 
                className={`
                  text-secondary-200 text-lg mb-8 max-w-md
                  ${slide.align === 'center' ? 'mx-auto' : ''}
                  ${index === currentSlide ? 'animate-slide-up' : ''}
                `}
                style={{ animationDelay: '0.5s' }}
              >
                {slide.description}
              </p>

              {/* CTA Button */}
              <div
                className={`
                  ${index === currentSlide ? 'animate-slide-up' : ''}
                `}
                style={{ animationDelay: '0.6s' }}
              >
                <Link to={slide.buttonLink}>
                  <Button 
                    variant="primary" 
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    {slide.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              transition-all duration-300
              ${index === currentSlide
                ? 'w-8 h-3 bg-primary-500 rounded-full'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-white/70">
        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-8">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-bounce" />
        </div>
      </div>

      {/* Side Text */}
      <div className="absolute left-8 bottom-1/4 z-20 hidden lg:block">
        <div className="flex items-center gap-4 text-white/50">
          <div className="w-12 h-px bg-white/30" />
          <span className="text-sm tracking-widest uppercase">Wonder Fashions</span>
        </div>
      </div>
    </section>
  );
};

// Mini Hero for inner pages
export const MiniHero = ({ 
  title, 
  subtitle, 
  backgroundImage,
  breadcrumbs = [] 
}) => {
  return (
    <section className="relative h-64 md:h-80 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-800" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full container-custom flex flex-col items-center justify-center text-center">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span>/</span>
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-white transition-colors">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-lg text-white/80 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;