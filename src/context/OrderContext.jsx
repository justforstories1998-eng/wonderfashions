import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialOrders, orderStatuses, paymentStatuses } from '../data/orders';

// Initial state
const initialState = {
  orders: [],
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

// Generate order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}${random}`;
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
      const newOrder = {
        ...action.payload,
        id: generateOrderId(),
        status: 'Pending',
        paymentStatus: action.payload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        orders: [newOrder, ...state.orders]
      };
    }

    case ORDER_ACTIONS.UPDATE_ORDER: {
      const updatedOrders = state.orders.map(order => {
        if (order.id === action.payload.id) {
          return {
            ...order,
            ...action.payload,
            updatedAt: new Date().toISOString()
          };
        }
        return order;
      });
      return {
        ...state,
        orders: updatedOrders
      };
    }

    case ORDER_ACTIONS.UPDATE_ORDER_STATUS: {
      const { orderId, status, paymentStatus } = action.payload;
      const updatedOrders = state.orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: status || order.status,
            paymentStatus: paymentStatus || order.paymentStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return order;
      });
      return {
        ...state,
        orders: updatedOrders
      };
    }

    case ORDER_ACTIONS.DELETE_ORDER: {
      const filteredOrders = state.orders.filter(
        order => order.id !== action.payload
      );
      return {
        ...state,
        orders: filteredOrders
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
    'wonderfashions_orders',
    initialOrders
  );
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Load orders from localStorage on mount
  useEffect(() => {
    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });
    try {
      dispatch({ type: ORDER_ACTIONS.LOAD_ORDERS, payload: savedOrders });
    } catch (error) {
      dispatch({ type: ORDER_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (state.orders.length > 0) {
      setSavedOrders(state.orders);
    }
  }, [state.orders, setSavedOrders]);

  // Action functions
  const addOrder = (orderData) => {
    dispatch({ type: ORDER_ACTIONS.ADD_ORDER, payload: orderData });
    // Return the generated order ID
    const newOrderId = generateOrderId();
    return newOrderId;
  };

  const updateOrder = (orderData) => {
    dispatch({ type: ORDER_ACTIONS.UPDATE_ORDER, payload: orderData });
  };

  const updateOrderStatus = (orderId, status, paymentStatus = null) => {
    dispatch({
      type: ORDER_ACTIONS.UPDATE_ORDER_STATUS,
      payload: { orderId, status, paymentStatus }
    });
  };

  const deleteOrder = (orderId) => {
    dispatch({ type: ORDER_ACTIONS.DELETE_ORDER, payload: orderId });
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return state.orders.find(order => order.id === orderId);
  };

  // Get orders by status
  const getOrdersByStatus = (status) => {
    return state.orders.filter(order => order.status === status);
  };

  // Get orders by customer email
  const getOrdersByCustomer = (email) => {
    return state.orders.filter(
      order => order.customerEmail.toLowerCase() === email.toLowerCase()
    );
  };

  // Get recent orders
  const getRecentOrders = (limit = 5) => {
    return [...state.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Get order statistics for admin dashboard
  const getOrderStats = () => {
    const totalOrders = state.orders.length;
    const pendingOrders = state.orders.filter(o => o.status === 'Pending').length;
    const processingOrders = state.orders.filter(o => o.status === 'Processing').length;
    const shippedOrders = state.orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = state.orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = state.orders.filter(o => o.status === 'Cancelled').length;

    const totalRevenue = state.orders
      .filter(o => o.status !== 'Cancelled' && o.paymentStatus === 'Paid')
      .reduce((sum, order) => sum + order.total, 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledOrders) : 0;

    // Get orders by month for chart
    const ordersByMonth = {};
    state.orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
    });

    // Get revenue by month for chart
    const revenueByMonth = {};
    state.orders
      .filter(o => o.status !== 'Cancelled' && o.paymentStatus === 'Paid')
      .forEach(order => {
        const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + order.total;
      });

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
      ordersByMonth,
      revenueByMonth
    };
  };

  // Calculate order totals
  const calculateOrderTotals = (items, shippingCost = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 100 ? 0 : shippingCost;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  // Create order from cart
  const createOrderFromCart = (cartItems, customerInfo, paymentMethod) => {
    const totals = calculateOrderTotals(cartItems, 5.99);
    
    const orderData = {
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress: {
        street: customerInfo.street,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.zipCode,
        country: customerInfo.country || 'USA'
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
      ...totals,
      paymentMethod
    };

    dispatch({ type: ORDER_ACTIONS.ADD_ORDER, payload: orderData });
    
    // Return the latest order
    return {
      ...orderData,
      id: state.orders.length > 0 ? generateOrderId() : 'ORD-001',
      status: 'Pending',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString()
    };
  };

  const value = {
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    orderStatuses,
    paymentStatuses,
    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderById,
    getOrdersByStatus,
    getOrdersByCustomer,
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