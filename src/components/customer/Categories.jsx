import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { ArrowRight } from 'lucide-react';

const Categories = ({ title, subtitle, previewMode = false }) => {
  const { categories } = useProducts();

  // Sort by order
  const sortedCategories = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="section bg-secondary-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary-600 font-semibold tracking-widest uppercase text-sm mb-2">
            Categories
          </span>
          <h2 className="section-title">
            {title || 'Shop by Category'}
          </h2>
          <p className="section-subtitle">
            {subtitle || 'Find exactly what you\'re looking for'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {sortedCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className={`group block animate-fade-in ${previewMode ? 'pointer-events-none' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary-500 transition-all duration-300 bg-white shadow-sm">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary-100 text-secondary-400 text-xs font-medium">
                    {category.name[0]}
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary-600 opacity-0 transform scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300 truncate px-2">
                  {category.name}
                </h3>
                {category.subcategories && category.subcategories.length > 0 && (
                  <p className="text-xs text-secondary-500 mt-1">
                    {category.subcategories.length} Sub-categories
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Popular Categories (Larger Cards for top categories)
export const PopularCategories = () => {
  const { categories } = useProducts();
  
  // Take first 3 enabled categories
  const popularCategories = categories
    .filter(c => c.enabled !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 3);

  if (popularCategories.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden animate-fade-in shadow-md hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image or Gradient */}
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${
                  index % 3 === 0 ? 'from-pink-500 to-rose-600' : 
                  index % 3 === 1 ? 'from-purple-500 to-indigo-600' : 
                  'from-teal-500 to-emerald-600'
                }`} />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-sm">
                    {category.subcategories ? `Explore ${category.subcategories.length} collections` : 'Explore Collection'}
                  </p>
                  <span className="inline-flex items-center gap-2 text-white font-medium border-b border-white/50 pb-1 group-hover:border-white transition-all duration-300">
                    Shop Now <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;