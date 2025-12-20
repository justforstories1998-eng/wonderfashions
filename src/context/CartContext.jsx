import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Calculate totals helper
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1, size, color } = action.payload;
      
      // Check if item already exists with same size and color
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );

      let updatedItems;

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        // Add new item
        const newItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size,
          color,
          quantity,
          stock: product.stock
        };
        updatedItems = [...state.items, newItem];
      }

      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { id, size, color } = action.payload;
      const updatedItems = state.items.filter(
        item => !(item.id === id && item.size === size && item.color === color)
      );
      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, size, color, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = state.items.filter(
          item => !(item.id === id && item.size === size && item.color === color)
        );
        const totals = calculateTotals(updatedItems);
        return { ...state, items: updatedItems, ...totals };
      }

      const updatedItems = state.items.map(item => {
        if (item.id === id && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      });

      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }

    case CART_ACTIONS.LOAD_CART: {
      const items = action.payload || [];
      const totals = calculateTotals(items);
      return { ...state, items, ...totals };
    }

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [savedCart, setSavedCart] = useLocalStorage('wonderfashions_cart', []);
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (savedCart && savedCart.length > 0) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedCart });
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    setSavedCart(state.items);
  }, [state.items, setSavedCart]);

  // Action functions
  const addToCart = (product, quantity = 1, size, color) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity, size, color }
    });
  };

  const removeFromCart = (id, size, color) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id, size, color }
    });
  };

  const updateQuantity = (id, size, color, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, size, color, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const getCartItemCount = () => {
    return state.totalItems;
  };

  const getCartTotal = () => {
    return state.totalPrice;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const value = {
    cart: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;