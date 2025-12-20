import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

const ProductCard = ({ product, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { formatPrice } = useSettings();

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  // Handle quick add to cart
  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add with default size and color
    addToCart(
      product, 
      1, 
      product.sizes[0], 
      product.colors[0]
    );
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={12}
        className={`${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-secondary-300'
        }`}
      />
    ));
  };

  // Variant styles
  const variants = {
    default: 'bg-white',
    compact: 'bg-white',
    featured: 'bg-white'
  };

  return (
    <div
      className={`
        card card-hover group relative
        ${variants[variant]}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4]">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Secondary Image on Hover */}
          {product.images && product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} - alternate`}
              className={`
                absolute inset-0 w-full h-full object-cover transition-opacity duration-500
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="badge badge-danger">
              -{discountPercentage}%
            </span>
          )}
          {product.newArrival && (
            <span className="badge badge-primary">
              New
            </span>
          )}
          {product.trending && (
            <span className="badge badge-success">
              Trending
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-secondary-800 text-white">
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <span className="badge badge-warning">
              Low Stock
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div 
          className={`
            absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          `}
        >
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`
              w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md
              ${isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-secondary-700 hover:bg-red-500 hover:text-white'
              }
            `}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          {/* Quick View Button */}
          <Link
            to={`/product/${product.id}`}
            className="w-9 h-9 rounded-full bg-white text-secondary-700 hover:bg-primary-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-md"
            aria-label="Quick view"
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Quick Add to Cart Button */}
        <div 
          className={`
            absolute bottom-0 left-0 right-0 p-3 transition-all duration-300
            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0 || addedToCart}
            className={`
              w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg
              ${addedToCart 
                ? 'bg-green-500 text-white' 
                : product.stock === 0
                  ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }
            `}
          >
            {addedToCart ? (
              <>
                <Check size={18} />
                Added to Cart
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag size={18} />
                Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-secondary-500 uppercase tracking-wider mb-1">
          {product.category}
        </p>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-secondary-500">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-secondary-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Colors Preview */}
        {variant !== 'compact' && product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-secondary-200"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-secondary-500 ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for product card
export const ProductCardSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="aspect-[3/4] bg-secondary-200" />
      <div className="p-4">
        <div className="h-3 bg-secondary-200 rounded w-1/4 mb-2" />
        <div className="h-5 bg-secondary-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-secondary-200 rounded w-1/2 mb-3" />
        <div className="h-6 bg-secondary-200 rounded w-1/3" />
      </div>
    </div>
  );
};

// Horizontal product card for cart/checkout
export const ProductCardHorizontal = ({ product, quantity, size, color, onRemove, onUpdateQuantity }) => {
  const { formatPrice } = useSettings();

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-secondary-100">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-secondary-900 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-secondary-500 mt-1">
          Size: {size} | Color: {color}
        </p>
        <p className="text-primary-600 font-bold mt-2">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Quantity & Actions */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="text-secondary-400 hover:text-red-500 transition-colors"
        >
          ×
        </button>
        <div className="flex items-center gap-2 border border-secondary-200 rounded-lg">
          <button
            onClick={() => onUpdateQuantity(quantity - 1)}
            className="px-3 py-1 text-secondary-600 hover:bg-secondary-100"
          >
            -
          </button>
          <span className="px-2">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(quantity + 1)}
            className="px-3 py-1 text-secondary-600 hover:bg-secondary-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;