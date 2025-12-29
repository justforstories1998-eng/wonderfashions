import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Clock, ShoppingBag } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCountry } from '../../context/CountryContext';
import ProductCard, { ProductCardSkeleton } from '../common/ProductCard';
import Button from '../common/Button';

// Helper for Admin Preview Text
const PreviewText = ({ text, className }) => <span className={className}>{text}</span>;

const FeaturedProducts = ({ title, subtitle, previewMode = false }) => {
  const [activeTab, setActiveTab] = useState('featured');
  const { getFeaturedProducts, getTrendingProducts, getNewArrivals, loading } = useProducts();

  const tabs = [
    { id: 'featured', label: 'Featured', icon: Sparkles, getProducts: getFeaturedProducts },
    { id: 'trending', label: 'Trending', icon: TrendingUp, getProducts: getTrendingProducts },
    { id: 'new', label: 'New Arrivals', icon: Clock, getProducts: getNewArrivals }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const products = currentTab ? currentTab.getProducts() : [];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">Our Collection</span>
          <h2 className="section-title">{title || 'Discover Amazing Products'}</h2>
          <p className="section-subtitle">{subtitle || 'Explore our carefully curated collection'}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg' : 'bg-secondary-100 text-secondary-700'}`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="product-grid">
          {loading ? (
            [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500">No products available in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const PromoBanner = ({ title, subtitle, buttonText, buttonLink, backgroundColor, backgroundImage, previewMode = false }) => {
  return (
    <section className="py-16 relative overflow-hidden" style={{ backgroundColor: backgroundColor || '#7c3aed' }}>
      {backgroundImage && (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt="" className="w-full h-full object-cover opacity-30" />
        </div>
      )}
      <div className="absolute inset-0 opacity-10 hero-pattern" />
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">{title || 'Special Offer'}</h2>
            <p className="text-white/80 text-lg max-w-xl">{subtitle || 'Limited time deal'}</p>
          </div>
          <div className={previewMode ? 'pointer-events-none' : ''}>
            <Link to={buttonLink || '/shop'}>
              <Button variant="white" size="lg">{buttonText || 'Shop Now'}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BestSellers = ({ title, previewMode = false }) => {
  const { getCountryProducts, loading } = useProducts();
  const products = getCountryProducts();
  const bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <section className="section bg-secondary-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">Customer Favourites</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">{title || 'Best Sellers'}</h2>
          </div>
          {!previewMode && (
            <Link to="/shop?sort=bestsellers"><Button variant="outline" icon={ArrowRight} iconPosition="right">View All</Button></Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />) : 
           bestSellers.length > 0 ? bestSellers.map(p => <ProductCard key={p.id} product={p} />) :
           <div className="col-span-4 text-center py-8 text-gray-500">No best sellers yet.</div>
          }
        </div>
      </div>
    </section>
  );
};

export const SpecialOffers = ({ title, previewMode = false }) => {
  const offers = [
    { id: 1, title: 'Summer Essentials', subtitle: 'Up to 40% Off', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', link: '/shop' },
    { id: 2, title: 'New Accessories', subtitle: 'Shop Now', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=600', link: '/shop' },
    { id: 3, title: 'Denim Collection', subtitle: 'Fresh Styles', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', link: '/shop' }
  ];

  return (
    <section className="section bg-white">
      <div className="container-custom">
        {title && <h2 className="section-title mb-8">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to={offers[0].link} className={`group relative h-96 md:h-full min-h-[400px] rounded-2xl overflow-hidden ${previewMode ? 'pointer-events-none' : ''}`}>
            <img src={offers[0].image} alt={offers[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3">{offers[0].subtitle}</span>
              <h3 className="text-3xl font-display font-bold text-white mb-2">{offers[0].title}</h3>
              <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-4 transition-all duration-300">Shop Now <ArrowRight size={18} /></span>
            </div>
          </Link>
          <div className="flex flex-col gap-6">
            {offers.slice(1).map((offer) => (
              <Link key={offer.id} to={offer.link} className={`group relative h-48 md:h-[calc(50%-12px)] rounded-2xl overflow-hidden ${previewMode ? 'pointer-events-none' : ''}`}>
                <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-primary-400 text-sm font-medium">{offer.subtitle}</span>
                  <h3 className="text-2xl font-display font-bold text-white">{offer.title}</h3>
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