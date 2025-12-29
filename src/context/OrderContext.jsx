import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialOrders, createOrder, calculateOrderTotals, orderStatuses, paymentStatuses, paymentMethods } from '../data/orders';
import { useCountry } from './CountryContext';

// Initial state
const initialState = {
  orders: initialOrders, // { india: [], uk: [] }
  loading: false,
  error: null
};

// Action types
const ORDER_ACTIONS = {
  LOAD_ORDERS: 'LOAD_ORDERS',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  DELETE_ORDER: 'DELETE_ORDER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.LOAD_ORDERS: {
      return {
        ...state,
        orders: action.payload,
        loading: false
      };
    }

    case ORDER_ACTIONS.ADD_ORDER: {
      const { country, order } = action.payload;
      return {
        ...state,
        orders: {
          ...state.orders,
          [country]: [order, ...(state.orders[country] || [])]
        }
      };
    }

    case ORDER_ACTIONS.UPDATE_ORDER: {
      const { country, order } = action.payload;
      return {
        ...state,
        orders: {
          ...state.orders,
          [country]: state.orders[country].map(o => 
            o.id === order.id ? { ...o, ...order, updatedAt: new Date().toISOString() } : o
          )
        }
      };
    }

    case ORDER_ACTIONS.UPDATE_ORDER_STATUS: {
      const { country, orderId, status, paymentStatus } = action.payload;
      return {
        ...state,
        orders: {
          ...state.orders,
          [country]: state.orders[country].map(o => {
            if (o.id === orderId) {
              return {
                ...o,
                status: status || o.status,
                paymentStatus: paymentStatus || o.paymentStatus,
                updatedAt: new Date().toISOString()
              };
            }
            return o;
          })
        }
      };
    }

    case ORDER_ACTIONS.DELETE_ORDER: {
      const { country, orderId } = action.payload;
      return {
        ...state,
        orders: {
          ...state.orders,
          [country]: state.orders[country].filter(o => o.id !== orderId)
        }
      };
    }

    case ORDER_ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }

    case ORDER_ACTIONS.SET_ERROR: {
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
const OrderContext = createContext();

// Provider component
export const OrderProvider = ({ children }) => {
  const [savedOrders, setSavedOrders] = useLocalStorage(
    'wonderfashions_orders_v2',
    initialOrders
  );
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { getCountryCode } = useCountry();

  // Load orders from localStorage on mount
  useEffect(() => {
    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    try {
      const mergedOrders = {
        india: savedOrders.india || [],
        uk: savedOrders.uk || []
      };
      dispatch({ type: ORDER_ACTIONS.LOAD_ORDERS, payload: mergedOrders });
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (state.orders) {
      setSavedOrders(state.orders);
    }
  }, [state.orders, setSavedOrders]);

  // Get current country (defaults to UK)
  const currentCountry = getCountryCode() || 'uk';

  // Action functions
  const addOrder = (orderData, country = currentCountry) => {
    const newOrder = createOrder(orderData, country);
    dispatch({ type: ORDER_ACTIONS.ADD_ORDER, payload: { country, order: newOrder } });
    return newOrder;
  };

  const updateOrder = (orderData, country = currentCountry) => {
    dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: { country, order: orderData } });
  };

  const updateOrderStatus = (orderId, status, paymentStatus = null, country) => {
    // If country is not provided, try to find the order to get its country
    let targetCountry = country;
    if (!targetCountry) {
      const allOrders = [
        ...(state.orders.uk || []).map(o => ({ ...o, country: 'uk' })),
        ...(state.orders.india || []).map(o => ({ ...o, country: 'india' }))
      ];
      const foundOrder = allOrders.find(o => o.id === orderId);
      if (foundOrder) targetCountry = foundOrder.country;
    }

    if (targetCountry) {
      dispatch({
        type: ORDER_ACTIONS.UPDATE_ORDER_STATUS,
        payload: { country: targetCountry, orderId, status, paymentStatus }
      });
    }
  };

  const deleteOrder = (orderId, country) => {
    dispatch({ type: ORDER_ACTIONS.DELETE_ORDER, payload: { country, orderId } });
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    const allOrders = [
      ...(state.orders.uk || []),
      ...(state.orders.india || [])
    ];
    return allOrders.find(order => order.id === orderId);
  };

  // Get orders list (combined or specific)
  const getOrders = (country = null) => {
    if (country) return state.orders[country] || [];
    
    // Combine all orders flattened with country property
    return [
      ...(state.orders.uk || []).map(o => ({...o, country: 'uk'})),
      ...(state.orders.india || []).map(o => ({...o, country: 'india'}))
    ];
  };

  // Get recent orders
  const getRecentOrders = (limit = 5) => {
    const allOrders = getOrders();
    return allOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Create order from cart
  const createOrderFromCart = (cartItems, customerInfo, paymentMethod) => {
    const totals = calculateOrderTotals(cartItems, 5.99, 0.20); // Using defaults, overridden later
    
    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress: {
        street: customerInfo.street,
        city: customerInfo.city,
        state: customerInfo.state,
        postcode: customerInfo.zipCode,
        country: customerInfo.country
      },
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      ...totals, // This will be recalculated properly in CheckoutForm
      paymentMethod
    };

    return addOrder(orderData, currentCountry);
  };

  // Get aggregated stats
  const getOrderStats = () => {
    const allOrders = getOrders(); // Get ALL orders from both countries
    const totalOrders = allOrders.length;
    
    const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
    const processingOrders = allOrders.filter(o => o.status === 'Processing').length;
    const shippedOrders = allOrders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = allOrders.filter(o => o.status === 'Cancelled').length;

    // Revenue calculation (Basic sum, ignoring currency differences for simple view)
    // Note: In a real app you'd convert currency. Here we just sum values.
    const totalRevenue = allOrders
      .filter(o => o.status !== 'Cancelled' && o.paymentStatus === 'Paid')
      .reduce((sum, order) => sum + order.total, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledOrders) : 0;

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue
    };
  };

  const value = {
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    orderStatuses,
    paymentStatuses,
    paymentMethods,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getOrders, // New function to get combined list
    getRecentOrders,
    getOrderStats,
    calculateOrderTotals,
    createOrderFromCart
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;