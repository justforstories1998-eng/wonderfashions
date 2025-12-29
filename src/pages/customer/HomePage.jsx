import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../../components/customer/Hero';
import FeaturedProducts, { PromoBanner, BestSellers, SpecialOffers } from '../../components/customer/FeaturedProducts';
import Categories, { PopularCategories } from '../../components/customer/Categories';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';
import Button from '../../components/common/Button';
import { featureIcons } from '../../data/settings';
import * as LucideIcons from 'lucide-react';

const HomePage = () => {
  const { getHomeDesign, loading } = useSettings();
  const { getCountryCode } = useCountry();
  const [sections, setSections] = useState([]);
  const [features, setFeatures] = useState([]);

  // Load home design
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!loading) {
      const countryCode = getCountryCode() || 'uk';
      const design = getHomeDesign(countryCode);
      
      // Filter enabled sections and sort by order
      const activeSections = (design.sections || [])
        .filter(s => s.enabled !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
        
      setSections(activeSections);
      
      // Filter enabled features
      const activeFeatures = (design.features || [])
        .filter(f => f.enabled !== false);
        
      setFeatures(activeFeatures);
    }
  }, [loading, getCountryCode, getHomeDesign]);

  // Helper to render dynamic icon
  const DynamicIcon = ({ name, size = 24, className }) => {
    const Icon = LucideIcons[name] || LucideIcons.Star;
    return <Icon size={size} className={className} />;
  };

  // Render section based on type
  const renderSection = (section) => {
    switch (section.type) {
      case 'categories':
        return (
          <Categories 
            key={section.id} 
            title={section.title} 
            subtitle={section.subtitle} 
          />
        );
        
      case 'featuredProducts':
        return (
          <FeaturedProducts 
            key={section.id} 
            title={section.title} 
            subtitle={section.subtitle} 
          />
        );
        
      case 'trendingProducts':
        return (
          <BestSellers 
            key={section.id} 
            title={section.title} 
          />
        );
        
      case 'newArrivals':
        return (
          <SpecialOffers 
            key={section.id} 
          />
        );
        
      case 'promoBanner':
        return (
          <section key={section.id} className="py-16 relative overflow-hidden" style={{ backgroundColor: section.backgroundColor || '#7c3aed' }}>
            {/* Background Image if exists */}
            {section.backgroundImage && (
              <div className="absolute inset-0">
                <img src={section.backgroundImage} alt="" className="w-full h-full object-cover opacity-30" />
              </div>
            )}
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 hero-pattern" />

            <div className="container-custom relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-white/80 text-lg max-w-xl">
                    {section.subtitle}
                  </p>
                </div>
                
                <Link to={section.buttonLink || '/shop'}>
                  <Button variant="white" size="lg">
                    {section.buttonText || 'Shop Now'}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        );
        
      case 'textBlock':
        return (
          <section key={section.id} className="section bg-white">
            <div className="container-custom text-center">
              <h2 className="section-title">{section.title}</h2>
              <div className="prose mx-auto text-secondary-600">
                {section.subtitle}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 animate-pulse">
        <div className="h-[600px] bg-secondary-200" />
        <div className="container-custom py-12 space-y-12">
          <div className="h-64 bg-secondary-200 rounded-xl" />
          <div className="h-64 bg-secondary-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Main Hero Slider */}
      <Hero />

      {/* Default Fallback if no sections configured */}
      {sections.length === 0 && (
        <>
          <PopularCategories />
          <FeaturedProducts />
          <PromoBanner />
          <BestSellers />
        </>
      )}

      {/* Dynamic Sections */}
      {sections.map(section => renderSection(section))}

      {/* Features Section (if configured) */}
      {features.length > 0 && (
        <section className="py-12 bg-secondary-50 border-t border-secondary-200">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map(feature => (
                <div key={feature.id} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                    <DynamicIcon name={feature.icon} size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">{feature.title}</h4>
                    <p className="text-sm text-secondary-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;