import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialProducts, categories } from '../data/products';

// Initial state
const initialState = {
  products: [],
  categories: categories,
  loading: false,
  error: null,
  filters: {
    category: '',
    priceRange: [0, 500],
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
      const newProduct = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        rating: 0,
        reviews: 0
      };
      return {
        ...state,
        products: [...state.products, newProduct]
      };
    }

    case PRODUCT_ACTIONS.UPDATE_PRODUCT: {
      const updatedProducts = state.products.map(product => {
        if (product.id === action.payload.id) {
          return { ...product, ...action.payload };
        }
        return product;
      });
      return {
        ...state,
        products: updatedProducts
      };
    }

    case PRODUCT_ACTIONS.DELETE_PRODUCT: {
      const filteredProducts = state.products.filter(
        product => product.id !== action.payload
      );
      return {
        ...state,
        products: filteredProducts
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
    'wonderfashions_products',
    initialProducts
  );
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load products from localStorage on mount
  useEffect(() => {
    dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
    try {
      dispatch({ type: PRODUCT_ACTIONS.LOAD_PRODUCTS, payload: savedProducts });
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (state.products.length > 0) {
      setSavedProducts(state.products);
    }
  }, [state.products, setSavedProducts]);

  // Action functions
  const addProduct = (productData) => {
    dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: productData });
  };

  const updateProduct = (productData) => {
    dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: productData });
  };

  const deleteProduct = (productId) => {
    dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: productId });
  };

  const setFilters = (filters) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: PRODUCT_ACTIONS.RESET_FILTERS });
  };

  // Get product by ID
  const getProductById = (productId) => {
    return state.products.find(product => product.id === parseInt(productId));
  };

  // Get filtered products
  const getFilteredProducts = () => {
    let filtered = [...state.products];
    const { category, priceRange, sortBy, searchQuery } = state.filters;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Sort products
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

  // Get featured products
  const getFeaturedProducts = () => {
    return state.products.filter(product => product.featured);
  };

  // Get trending products
  const getTrendingProducts = () => {
    return state.products.filter(product => product.trending);
  };

  // Get new arrivals
  const getNewArrivals = () => {
    return state.products.filter(product => product.newArrival);
  };

  // Get products by category
  const getProductsByCategory = (categoryName) => {
    return state.products.filter(
      product => product.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  // Get related products
  const getRelatedProducts = (productId, limit = 4) => {
    const product = getProductById(productId);
    if (!product) return [];

    return state.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, limit);
  };

  // Get product stats for admin
  const getProductStats = () => {
    const totalProducts = state.products.length;
    const totalStock = state.products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockProducts = state.products.filter(p => p.stock < 10).length;
    const outOfStockProducts = state.products.filter(p => p.stock === 0).length;
    const categoryCounts = state.categories.map(cat => ({
      name: cat.name,
      count: state.products.filter(p => p.category === cat.name).length
    }));

    return {
      totalProducts,
      totalStock,
      lowStockProducts,
      outOfStockProducts,
      categoryCounts
    };
  };

  const value = {
    products: state.products,
    categories: state.categories,
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
    getProductsByCategory,
    getRelatedProducts,
    getProductStats
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