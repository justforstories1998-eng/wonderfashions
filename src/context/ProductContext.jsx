import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialProducts, createProduct } from '../data/products';
import { useSettings } from './SettingsContext';
import { useCountry } from './CountryContext';

// Initial state
const initialState = {
  products: initialProducts, // { india: [], uk: [] }
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 10000],
    sortBy: 'newest',
    searchQuery: ''
  }
};

// Action types
const PRODUCT_ACTIONS = {
  LOAD_PRODUCTS: 'LOAD_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.LOAD_PRODUCTS: {
      return {
        ...state,
        products: action.payload,
        loading: false
      };
    }

    case PRODUCT_ACTIONS.ADD_PRODUCT: {
      const { country, product } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          [country]: [...(state.products[country] || []), product]
        }
      };
    }

    case PRODUCT_ACTIONS.UPDATE_PRODUCT: {
      const { country, product } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          [country]: state.products[country].map(p => 
            p.id === product.id ? { ...p, ...product, updatedAt: new Date().toISOString() } : p
          )
        }
      };
    }

    case PRODUCT_ACTIONS.DELETE_PRODUCT: {
      const { country, productId } = action.payload;
      return {
        ...state,
        products: {
          ...state.products,
          [country]: state.products[country].filter(p => p.id !== productId)
        }
      };
    }

    case PRODUCT_ACTIONS.SET_FILTERS: {
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    }

    case PRODUCT_ACTIONS.RESET_FILTERS: {
      return {
        ...state,
        filters: initialState.filters
      };
    }

    case PRODUCT_ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }

    case PRODUCT_ACTIONS.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [savedProducts, setSavedProducts] = useLocalStorage(
    'wonderfashions_products_v2',
    initialProducts
  );
  const [state, dispatch] = useReducer(productReducer, initialState);
  const { settings } = useSettings();
  const { getCountryCode } = useCountry();

  useEffect(() => {
    dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
    try {
      // Ensure structure exists
      const mergedProducts = {
        india: savedProducts.india || [],
        uk: savedProducts.uk || []
      };
      dispatch({ type: PRODUCT_ACTIONS.LOAD_PRODUCTS, payload: mergedProducts });
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  useEffect(() => {
    if (state.products) {
      setSavedProducts(state.products);
    }
  }, [state.products, setSavedProducts]);

  const currentCountry = getCountryCode() || 'uk';

  const getCountryProducts = (country = currentCountry) => {
    return state.products[country] || [];
  };

  const addProduct = (productData, country = 'uk') => {
    const newProduct = createProduct(productData, country);
    dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: { country, product: newProduct } });
    return newProduct;
  };

  const updateProduct = (productData, country = 'uk') => {
    dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: { country, product: productData } });
  };

  const deleteProduct = (productId, country = 'uk') => {
    dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: { country, productId } });
  };

  const setFilters = (filters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: PRODUCT_ACTIONS.RESET_FILTERS });
  };

  const getProductById = (productId, country = currentCountry) => {
    return state.products[country]?.find(product => product.id === productId);
  };

  const getFilteredProducts = (country = currentCountry) => {
    let filtered = [...(state.products[country] || [])];
    const { category, priceRange, sortBy, searchQuery } = state.filters;

    filtered = filtered.filter(p => p.enabled !== false);

    const isSaleFilter = window.location.search.includes('filter=sale');
    if (isSaleFilter) {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    if (category) {
      // Check if it matches main category OR subcategory
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category.toLowerCase() ||
        product.subcategory?.toLowerCase() === category.toLowerCase()
      );
    }

    if (priceRange) {
      filtered = filtered.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const getFeaturedProducts = (country = currentCountry) => {
    return (state.products[country] || [])
      .filter(product => product.featured && product.enabled !== false);
  };

  const getTrendingProducts = (country = currentCountry) => {
    return (state.products[country] || [])
      .filter(product => product.trending && product.enabled !== false);
  };

  const getNewArrivals = (country = currentCountry) => {
    return (state.products[country] || [])
      .filter(product => product.newArrival && product.enabled !== false);
  };

  const getProductsByCategory = (categoryName, country = currentCountry) => {
    return (state.products[country] || [])
      .filter(product => 
        (product.category.toLowerCase() === categoryName.toLowerCase() || 
         product.subcategory?.toLowerCase() === categoryName.toLowerCase()) && 
        product.enabled !== false
      );
  };

  const getRelatedProducts = (productId, limit = 4, country = currentCountry) => {
    const product = getProductById(productId, country);
    if (!product) return [];

    return (state.products[country] || [])
      .filter(p => 
        p.category === product.category && 
        p.id !== product.id && 
        p.enabled !== false
      )
      .slice(0, limit);
  };

  // UPDATED: Get categories logic
  const getCategories = () => {
    // 1. Prioritize Settings (The correct source for empty store)
    if (settings && settings.categories && settings.categories.length > 0) {
      return settings.categories.filter(c => c.enabled !== false);
    }
    
    // 2. Fallback: Derive from products (Only if settings missing)
    const countryProducts = state.products[currentCountry] || [];
    const uniqueCategories = [...new Set(countryProducts.map(p => p.category))];
    
    return uniqueCategories.map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count: countryProducts.filter(p => p.category === name).length,
      image: null,
      subcategories: []
    }));
  };

  const getProductStats = (country = 'uk') => {
    const countryProducts = state.products[country] || [];
    const totalProducts = countryProducts.length;
    const totalStock = countryProducts.reduce((sum, p) => sum + p.stock, 0);
    const lowStockProducts = countryProducts.filter(p => p.stock < 10).length;
    const outOfStockProducts = countryProducts.filter(p => p.stock === 0).length;
    
    const categoryCounts = {};
    countryProducts.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return {
      totalProducts,
      totalStock,
      lowStockProducts,
      outOfStockProducts,
      categoryCounts: Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
    };
  };

  const value = {
    products: state.products,
    categories: getCategories(),
    filters: state.filters,
    loading: state.loading,
    error: state.error,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    resetFilters,
    
    // Getters
    getProductById,
    getFilteredProducts,
    getFeaturedProducts,
    getTrendingProducts,
    getNewArrivals,
    getProductsByCategory,
    getRelatedProducts,
    getProductStats,
    getCountryProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;