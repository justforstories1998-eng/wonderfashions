// Empty products for production - Admin will add products via admin panel

export const initialProducts = {
  india: [],
  uk: []
};

// Default product template for creating new products
export const defaultProduct = {
  id: '',
  name: '',
  description: '',
  price: 0,
  originalPrice: null,
  category: '',
  image: null,
  images: [],
  sizes: [],
  colors: [],
  stock: 0,
  rating: 0,
  reviews: 0,
  featured: false,
  trending: false,
  newArrival: true,
  enabled: true,
  createdAt: '',
  updatedAt: ''
};

// Available sizes options
export const availableSizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL',
  '24', '26', '28', '30', '32', '34', '36', '38', '40',
  'One Size',
  'UK 4', 'UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18',
  'EU 34', 'EU 36', 'EU 38', 'EU 40', 'EU 42', 'EU 44', 'EU 46'
];

// Common colors
export const availableColors = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple',
  'Pink', 'Brown', 'Grey', 'Navy', 'Beige', 'Cream', 'Burgundy', 'Teal',
  'Olive', 'Coral', 'Lavender', 'Mint', 'Rose Gold', 'Gold', 'Silver',
  'Multi-color', 'Floral', 'Striped', 'Polka Dot', 'Plaid', 'Animal Print'
];

// Helper function to generate product ID
export const generateProductId = () => {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to create new product
export const createProduct = (productData, country) => {
  const now = new Date().toISOString();
  return {
    ...defaultProduct,
    ...productData,
    id: generateProductId(),
    createdAt: now,
    updatedAt: now
  };
};

// Helper function to format product for display
export const formatProduct = (product, currencySymbol) => {
  return {
    ...product,
    formattedPrice: `${currencySymbol}${product.price.toFixed(2)}`,
    formattedOriginalPrice: product.originalPrice 
      ? `${currencySymbol}${product.originalPrice.toFixed(2)}` 
      : null,
    discount: product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100) 
      : 0
  };
};