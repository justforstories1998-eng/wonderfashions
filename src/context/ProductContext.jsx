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
    priceRange: [0, 100000],
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
          [country]: (state.products[country] || []).map(p => 
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
          [country]: (state.products[country] || []).filter(p => p.id !== productId)
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
    'wonderfashions_products_v3', // Incremented version to ensure clean data
    initialProducts
  );
  const [state, dispatch] = useReducer(productReducer, initialState);
  const { settings } = useSettings();
  const { getCountryCode } = useCountry();

  useEffect(() => {
    dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
    try {
      const mergedProducts = {
        india: savedProducts?.india || [],
        uk: savedProducts?.uk || []
      };
      dispatch({ PRODUCT_ACTIONS_LOAD: PRODUCT_ACTIONS.LOAD_PRODUCTS, payload: mergedProducts });
      // Corrected the dispatch type above
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

    const now = new Date();

    // 1. Filter enabled and non-expired
    filtered = filtered.filter(p => {
      const isEnabled = p.enabled !== false;
      const isNotExpired = !p.expiresAt || new Date(p.expiresAt) > now;
      return isEnabled && isNotExpired;
    });

    // 2. Filter by Sale
    const isSaleFilter = window.location.search.includes('filter=sale');
    if (isSaleFilter) {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // 3. Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // 4. Category / Subcategory
    if (category) {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === category.toLowerCase() ||
        product.subcategory?.toLowerCase() === category.toLowerCase()
      );
    }

    // 5. Price Range
    if (priceRange) {
      filtered = filtered.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // 6. Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const getFeaturedProducts = (country = currentCountry) => {
    const now = new Date();
    return (state.products[country] || [])
      .filter(p => p.featured && p.enabled !== false && (!p.expiresAt || new Date(p.expiresAt) > now));
  };

  const getTrendingProducts = (country = currentCountry) => {
    const now = new Date();
    return (state.products[country] || [])
      .filter(p => p.trending && p.enabled !== false && (!p.expiresAt || new Date(p.expiresAt) > now));
  };

  const getNewArrivals = (country = currentCountry) => {
    const now = new Date();
    return (state.products[country] || [])
      .filter(p => p.newArrival && p.enabled !== false && (!p.expiresAt || new Date(p.expiresAt) > now));
  };

  const getCategories = () => {
    if (settings && settings.categories && settings.categories.length > 0) {
      return settings.categories.filter(c => c.enabled !== false);
    }
    return [];
  };

  const getProductStats = (country = 'uk') => {
    const countryProducts = state.products[country] || [];
    const totalProducts = countryProducts.length;
    const totalStock = countryProducts.reduce((sum, p) => sum + (parseInt(p.stock) || 0), 0);
    const lowStockProducts = countryProducts.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockProducts = countryProducts.filter(p => !p.stock || parseInt(p.stock) === 0).length;
    
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
    addProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    resetFilters,
    getProductById,
    getFilteredProducts,
    getFeaturedProducts,
    getTrendingProducts,
    getNewArrivals,
    getProductStats,
    getCountryProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;