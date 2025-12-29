// Empty orders for production - Orders will be created by customers

export const initialOrders = {
  india: [],
  uk: []
};

// Order statuses
export const orderStatuses = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Refunded'
];

// Payment statuses
export const paymentStatuses = [
  'Pending',
  'Paid',
  'Failed',
  'Refunded',
  'Partially Refunded'
];

// Payment methods per country
export const paymentMethods = {
  india: [
    { id: 'upi', name: 'UPI', icon: 'Smartphone' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'netbanking', name: 'Net Banking', icon: 'Building' },
    { id: 'wallet', name: 'Wallet (Paytm, PhonePe)', icon: 'Wallet' },
    { id: 'cod', name: 'Cash on Delivery', icon: 'Banknote' }
  ],
  uk: [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
    { id: 'applepay', name: 'Apple Pay', icon: 'Smartphone' },
    { id: 'googlepay', name: 'Google Pay', icon: 'Smartphone' },
    { id: 'klarna', name: 'Klarna (Buy Now Pay Later)', icon: 'Clock' }
  ]
};

// Default order template
export const defaultOrder = {
  id: '',
  country: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  },
  billingAddress: {
    sameAsShipping: true,
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  },
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  couponCode: null,
  status: 'Pending',
  paymentMethod: '',
  paymentStatus: 'Pending',
  paymentId: null,
  notes: '',
  trackingNumber: null,
  trackingUrl: null,
  createdAt: '',
  updatedAt: ''
};

// Generate order ID
export const generateOrderId = (country) => {
  const prefix = country === 'india' ? 'IN' : 'UK';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

// Create new order
export const createOrder = (orderData, country) => {
  const now = new Date().toISOString();
  return {
    ...defaultOrder,
    ...orderData,
    id: generateOrderId(country),
    country: country,
    createdAt: now,
    updatedAt: now
  };
};

// Calculate order totals
export const calculateOrderTotals = (items, shippingCost, taxRate, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 100 ? 0 : shippingCost; // Free shipping threshold
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * taxRate;
  const total = subtotal + shipping + tax - discount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};

// Get status color for UI
export const getStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Confirmed': 'bg-blue-100 text-blue-700',
    'Processing': 'bg-indigo-100 text-indigo-700',
    'Shipped': 'bg-purple-100 text-purple-700',
    'Out for Delivery': 'bg-orange-100 text-orange-700',
    'Delivered': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'Refunded': 'bg-gray-100 text-gray-700'
  };
  return colors[status] || 'bg-secondary-100 text-secondary-700';
};

// Get payment status color for UI
export const getPaymentStatusColor = (status) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Paid': 'bg-green-100 text-green-700',
    'Failed': 'bg-red-100 text-red-700',
    'Refunded': 'bg-gray-100 text-gray-700',
    'Partially Refunded': 'bg-orange-100 text-orange-700'
  };
  return colors[status] || 'bg-secondary-100 text-secondary-700';
};

// Format order date
export const formatOrderDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get order timeline
export const getOrderTimeline = (order) => {
  const timeline = [
    {
      status: 'Pending',
      label: 'Order Placed',
      description: 'Your order has been placed successfully',
      completed: true,
      date: order.createdAt
    },
    {
      status: 'Confirmed',
      label: 'Order Confirmed',
      description: 'Your order has been confirmed',
      completed: ['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status),
      date: null
    },
    {
      status: 'Processing',
      label: 'Processing',
      description: 'Your order is being prepared',
      completed: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status),
      date: null
    },
    {
      status: 'Shipped',
      label: 'Shipped',
      description: 'Your order has been shipped',
      completed: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status),
      date: null
    },
    {
      status: 'Out for Delivery',
      label: 'Out for Delivery',
      description: 'Your order is out for delivery',
      completed: ['Out for Delivery', 'Delivered'].includes(order.status),
      date: null
    },
    {
      status: 'Delivered',
      label: 'Delivered',
      description: 'Your order has been delivered',
      completed: order.status === 'Delivered',
      date: null
    }
  ];

  return timeline;
};