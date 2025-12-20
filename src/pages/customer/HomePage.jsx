import React, { useEffect } from 'react';
import Hero from '../../components/customer/Hero';
import FeaturedProducts, { PromoBanner, BestSellers, SpecialOffers } from '../../components/customer/FeaturedProducts';
import Categories, { PopularCategories } from '../../components/customer/Categories';

const HomePage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* Main Hero Slider */}
      <Hero />

      {/* Popular Categories (Large Cards) */}
      <PopularCategories />

      {/* Featured Products Tabs */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Best Selling Products */}
      <BestSellers />

      {/* Special Offers Grid */}
      <SpecialOffers />

      {/* All Categories Grid */}
      <Categories />
    </div>
  );
};

export default HomePage;