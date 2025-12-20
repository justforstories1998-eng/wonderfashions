import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';
import ProductCard, { ProductCardSkeleton } from '../common/ProductCard';
import Button from '../common/Button';

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const { 
    getFeaturedProducts, 
    getTrendingProducts, 
    getNewArrivals, 
    loading 
  } = useProducts();

  // Tabs configuration
  const tabs = [
    { 
      id: 'featured', 
      label: 'Featured', 
      icon: Sparkles,
      getProducts: getFeaturedProducts 
    },
    { 
      id: 'trending', 
      label: 'Trending', 
      icon: TrendingUp,
      getProducts: getTrendingProducts 
    },
    { 
      id: 'new', 
      label: 'New Arrivals', 
      icon: Clock,
      getProducts: getNewArrivals 
    }
  ];

  // Get current tab's products
  const currentTab = tabs.find(tab => tab.id === activeTab);
  const products = currentTab ? currentTab.getProducts() : [];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">
            Our Collection
          </span>
          <h2 className="section-title">
            Discover Amazing Products
          </h2>
          <p className="section-subtitle">
            Explore our carefully curated collection of trendy fashion pieces
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }
                `}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="product-grid">
          {loading ? (
            // Loading skeletons
            [...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : products.length > 0 ? (
            // Products
            products.slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            // No products message
            <div className="col-span-full text-center py-12">
              <p className="text-secondary-500 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button
                variant="outline"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// Promotional Banner Component
export const PromoBanner = () => {
  const { settings } = useSettings();
  const currencySymbol = settings?.currency?.symbol || '£';

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 hero-pattern" />
      </div>

      {/* Decorative Circles */}
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Get 30% Off Your First Order
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              Sign up for our newsletter and receive an exclusive discount code for your first purchase.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-72 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="white" size="lg">
              Get Code
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Best Sellers Section
export const BestSellers = () => {
  const { products, loading } = useProducts();
  const { formatPrice } = useSettings();

  // Get top rated products as best sellers
  const bestSellers = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section className="section bg-secondary-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">
              Customer Favourites
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">
              Best Sellers
            </h2>
          </div>
          <Link to="/shop?sort=bestsellers">
            <Button
              variant="outline"
              icon={ArrowRight}
              iconPosition="right"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : (
            bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// Special Offers Grid
export const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: 'Summer Essentials',
      subtitle: 'Up to 40% Off',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
      link: '/shop?category=summer',
      size: 'large'
    },
    {
      id: 2,
      title: 'New Accessories',
      subtitle: 'Shop Now',
      image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600',
      link: '/shop?category=accessories',
      size: 'small'
    },
    {
      id: 3,
      title: 'Denim Collection',
      subtitle: 'Fresh Styles',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
      link: '/shop?category=jeans',
      size: 'small'
    }
  ];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large Card */}
          <Link 
            to={offers[0].link}
            className="group relative h-96 md:h-full min-h-[400px] rounded-2xl overflow-hidden"
          >
            <img
              src={offers[0].image}
              alt={offers[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3">
                {offers[0].subtitle}
              </span>
              <h3 className="text-3xl font-display font-bold text-white mb-2">
                {offers[0].title}
              </h3>
              <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all duration-300">
                Shop Now <ArrowRight size={18} />
              </span>
            </div>
          </Link>

          {/* Small Cards */}
          <div className="flex flex-col gap-6">
            {offers.slice(1).map((offer) => (
              <Link
                key={offer.id}
                to={offer.link}
                className="group relative h-48 md:h-[calc(50%-12px)] rounded-2xl overflow-hidden"
              >
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-primary-400 text-sm font-medium">
                    {offer.subtitle}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white">
                    {offer.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;