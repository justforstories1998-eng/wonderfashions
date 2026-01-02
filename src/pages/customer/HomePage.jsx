import React, { useEffect, useState } from 'react';
import Hero from '../../components/customer/Hero';
import FeaturedProducts, { PromoBanner, BestSellers, SpecialOffers } from '../../components/customer/FeaturedProducts';
import Categories, { PopularCategories } from '../../components/customer/Categories';
import RoyalDivider from '../../components/common/RoyalDivider'; // Import Divider
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';

const HomePage = () => {
  const { getHomeDesign, loading } = useSettings();
  const { getCountryCode } = useCountry();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!loading) {
      const countryCode = getCountryCode() || 'uk';
      const design = getHomeDesign(countryCode);
      const activeSections = (design.sections || [])
        .filter(s => s.enabled !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setSections(activeSections);
    }
  }, [loading, getCountryCode, getHomeDesign]);

  const renderSection = (section) => {
    // Adding vertical margin to every dynamic section
    const sectionWrapper = (component) => (
      <div key={section.id} className="mt-20 animate-fade-in">
        {component}
        <RoyalDivider /> 
      </div>
    );

    switch (section.type) {
      case 'categories': return sectionWrapper(<Categories title={section.title} subtitle={section.subtitle} />);
      case 'featuredProducts': return sectionWrapper(<FeaturedProducts title={section.title} subtitle={section.subtitle} />);
      case 'trendingProducts': return sectionWrapper(<BestSellers title={section.title} />);
      case 'promoBanner':
        return (
          <div key={section.id} className="mt-24 mb-24">
            <PromoBanner {...section} />
          </div>
        );
      default: return null;
    }
  };

  if (loading) return <div className="h-screen bg-secondary-50 animate-pulse" />;

  return (
    <div className="flex flex-col gap-0 pb-20">
      {/* 1. Main Hero Slider */}
      <Hero />

      {/* 2. Added Space & Divider immediately after Hero */}
      <div className="mt-20">
        <RoyalDivider />
      </div>

      {/* 3. Dynamic Content */}
      {sections.length === 0 ? (
        <div className="container-custom py-20 text-center">
           <h2 className="text-3xl font-display font-bold text-primary-900">Experience Royal Tradition</h2>
           <p className="text-secondary-600 mt-4 italic">Configure your home page in the admin panel to see your collections here.</p>
        </div>
      ) : (
        sections.map(section => renderSection(section))
      )}
    </div>
  );
};

export default HomePage;