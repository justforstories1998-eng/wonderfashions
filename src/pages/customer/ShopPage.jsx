import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import { MiniHero } from '../../components/customer/Hero';
import Button from '../../components/common/Button';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    getFilteredProducts, 
    categories, 
    filters, 
    setFilters, 
    resetFilters,
    loading 
  } = useProducts();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState([0, 500]);
  
  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    const sortParam = searchParams.get('sort');
    const filterParam = searchParams.get('filter'); // new, sale, etc.

    const newFilters = {};
    if (categoryParam) newFilters.category = categoryParam;
    if (searchParam) newFilters.searchQuery = searchParam;
    if (sortParam) newFilters.sortBy = sortParam;
    
    // Handle special filter params
    if (filterParam === 'new') newFilters.sortBy = 'newest';
    // Note: 'sale' and 'bestsellers' logic would typically be here if the context supported it directly via filter object
    // For now, we rely on the ProductContext logic.

    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
    }
  }, [searchParams]);

  // Sync local price range with global filter
  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const products = getFilteredProducts();

  const handleCategoryChange = (categoryName) => {
    setFilters({ category: categoryName === filters.category ? '' : categoryName });
  };

  const handleSortChange = (e) => {
    setFilters({ sortBy: e.target.value });
  };

  const handlePriceChange = (e, index) => {
    const newRange = [...localPriceRange];
    newRange[index] = parseInt(e.target.value);
    setLocalPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    setFilters({ priceRange: localPriceRange });
  };

  const clearAllFilters = () => {
    resetFilters();
    setSearchParams({});
    setLocalPriceRange([0, 500]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MiniHero 
        title="Shop Our Collection" 
        subtitle="Find your perfect style from our wide range of products"
        backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
        breadcrumbs={[{ name: 'Shop', path: '/shop' }]}
      />

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              fullWidth
              icon={Filter}
              onClick={() => setIsMobileFilterOpen(true)}
            >
              Filters & Sort
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside 
            className={`
              fixed inset-0 z-40 bg-white p-6 overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 lg:w-64 lg:block lg:p-0 lg:bg-transparent lg:overflow-visible
              ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-secondary-900">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X size={24} className="text-secondary-500" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={18} />
                Categories
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                    ${!filters.category ? 'bg-primary-600 border-primary-600' : 'border-secondary-300 group-hover:border-primary-500'}
                  `}>
                    {!filters.category && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={!filters.category}
                    onChange={() => handleCategoryChange('')}
                  />
                  <span className={`${!filters.category ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}>
                    All Categories
                  </span>
                </label>
                
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${filters.category === category.name ? 'bg-primary-600 border-primary-600' : 'border-secondary-300 group-hover:border-primary-500'}
                    `}>
                      {filters.category === category.name && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={filters.category === category.name}
                      onChange={() => handleCategoryChange(category.name)}
                    />
                    <span className={`${filters.category === category.name ? 'text-primary-600 font-medium' : 'text-secondary-600'}`}>
                      {category.name}
                    </span>
                    <span className="text-xs text-secondary-400 ml-auto">({category.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="font-semibold text-secondary-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-secondary-500 mb-1 block">Min</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                      <input
                        type="number"
                        value={localPriceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full pl-6 pr-2 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-secondary-500 mb-1 block">Max</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">$</span>
                      <input
                        type="number"
                        value={localPriceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full pl-6 pr-2 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Range Slider (Simplified) */}
                <div className="relative h-2 bg-secondary-200 rounded-full mt-2">
                  <div 
                    className="absolute h-full bg-primary-500 rounded-full"
                    style={{ 
                      left: `${(localPriceRange[0] / 1000) * 100}%`, 
                      right: `${100 - (localPriceRange[1] / 1000) * 100}%` 
                    }}
                  />
                </div>

                <Button 
                  size="sm" 
                  fullWidth 
                  onClick={applyPriceFilter}
                  disabled={loading}
                >
                  Apply Price
                </Button>
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={clearAllFilters}
              className="text-sm text-secondary-500 hover:text-red-500 underline decoration-dotted underline-offset-4 transition-colors"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Overlay for mobile sidebar */}
          {isMobileFilterOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header: Sort & Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-secondary-500">
                Showing <span className="font-semibold text-secondary-900">{products.length}</span> results
              </p>
              
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-secondary-600 whitespace-nowrap">Sort by:</label>
                <select
                  id="sort"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="bg-white border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-secondary-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 mb-4">
                  <Filter size={32} className="text-secondary-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">No products found</h3>
                <p className="text-secondary-500 max-w-xs mx-auto mb-6">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;