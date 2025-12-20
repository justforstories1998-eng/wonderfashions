import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Check
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import ProductCard, { ProductCardSkeleton } from '../../components/common/ProductCard';
import Button from '../../components/common/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, getRelatedProducts, loading } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice, settings } = useSettings();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Get currency symbol
  const currencySymbol = settings?.currency?.symbol || '£';
  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 100;

  // Fetch product data
  useEffect(() => {
    window.scrollTo(0, 0);
    const productData = getProductById(id);
    
    if (productData) {
      setProduct(productData);
      setRelatedProducts(getRelatedProducts(id, 4));
      // Set defaults
      if (productData.sizes?.length > 0) setSelectedSize(productData.sizes[0]);
      if (productData.colors?.length > 0) setSelectedColor(productData.colors[0]);
      setSelectedImage(0);
      setQuantity(1);
      setAddedToCart(false);
    }
  }, [id, getProductById, getRelatedProducts]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.warning('Please select a colour');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart!`);

    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      toast.warning('Please select size and colour');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        className={`${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-secondary-300'
        }`}
      />
    ));
  };

  // Calculate discount
  const discountPercentage = product?.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0;

  if (loading || !product) {
    return (
      <div className="container-custom py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-secondary-50 py-4 border-b border-secondary-100">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-secondary-500 hover:text-primary-600">Home</Link>
            <ChevronRight size={14} className="text-secondary-400" />
            <Link to="/shop" className="text-secondary-500 hover:text-primary-600">Shop</Link>
            <ChevronRight size={14} className="text-secondary-400" />
            <Link to={`/shop?category=${product.category}`} className="text-secondary-500 hover:text-primary-600">
              {product.category}
            </Link>
            <ChevronRight size={14} className="text-secondary-400" />
            <span className="text-secondary-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-secondary-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                    <span className="badge badge-danger">-{discountPercentage}%</span>
                  )}
                  {product.newArrival && (
                    <span className="badge badge-primary">New</span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`
                    absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isWishlisted 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-secondary-600 hover:bg-red-500 hover:text-white'}
                  `}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`
                        flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                        ${selectedImage === index 
                          ? 'border-primary-600 ring-2 ring-primary-200' 
                          : 'border-transparent hover:border-secondary-300'}
                      `}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category */}
              <Link 
                to={`/shop?category=${product.category}`}
                className="text-primary-600 text-sm font-medium hover:underline mb-2"
              >
                {product.category}
              </Link>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-secondary-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-secondary-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="badge badge-danger">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-secondary-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-secondary-900">Size</span>
                  <button className="text-sm text-primary-600 hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        px-4 py-2 rounded-lg border-2 font-medium transition-all
                        ${selectedSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-600'
                          : 'border-secondary-200 text-secondary-700 hover:border-secondary-400'}
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <span className="font-medium text-secondary-900 mb-3 block">
                  Colour: <span className="text-secondary-600 font-normal">{selectedColor}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                        ${selectedColor === color
                          ? 'border-primary-600 ring-2 ring-primary-200'
                          : 'border-secondary-200 hover:border-secondary-400'}
                      `}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && (
                        <Check size={16} className={`${['White', 'Yellow', 'Cream', 'Beige'].includes(color) ? 'text-secondary-800' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <span className="font-medium text-secondary-900 mb-3 block">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-secondary-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-secondary-600 hover:bg-secondary-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 text-secondary-600 hover:bg-secondary-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <span className="text-sm text-secondary-500">
                    {product.stock > 0 
                      ? `${product.stock} items available` 
                      : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={addedToCart ? Check : ShoppingBag}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={addedToCart ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-secondary-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Free Delivery</p>
                    <p className="text-xs text-secondary-500">On orders {currencySymbol}{freeShippingThreshold}+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Easy Returns</p>
                    <p className="text-xs text-secondary-500">30 day returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900">Secure Payment</p>
                    <p className="text-xs text-secondary-500">100% secure</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-secondary-200">
                <span className="text-secondary-600">Share:</span>
                <button className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 hover:bg-primary-100 hover:text-primary-600 transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;