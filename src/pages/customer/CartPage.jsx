import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Tag,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import CartItem from '../../components/customer/CartItem';
import Button from '../../components/common/Button';
import { MiniHero } from '../../components/customer/Hero';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, totalItems, totalPrice, clearCart } = useCart();
  const { calculateOrderTotals } = useOrders();
  const { formatPrice, settings, getTaxName } = useSettings();

  // Get settings values
  const currencySymbol = settings?.currency?.symbol || '£';
  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold || 100;
  const taxName = getTaxName() || 'VAT';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate totals
  const totals = calculateOrderTotals(cart, settings?.shipping?.standardShippingCost || 4.99);

  // Empty cart view
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <MiniHero 
          title="Shopping Basket" 
          subtitle="Your basket is empty"
          breadcrumbs={[{ name: 'Basket', path: '/cart' }]}
        />

        <div className="container-custom py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary-100 flex items-center justify-center">
              <ShoppingBag size={48} className="text-secondary-400" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Your basket is empty
            </h2>
            <p className="text-secondary-600 mb-8">
              Looks like you haven't added any items to your basket yet. 
              Start shopping to fill it up!
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg" icon={ArrowLeft}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <MiniHero 
        title="Shopping Basket" 
        subtitle={`You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your basket`}
        breadcrumbs={[{ name: 'Basket', path: '/cart' }]}
      />

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900">
                Basket Items ({totalItems})
              </h2>
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                Clear Basket
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {cart.map((item, index) => (
                <CartItem key={`${item.id}-${item.size}-${item.color}`} item={item} />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link to="/shop">
                <Button variant="outline" icon={ArrowLeft}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                Order Summary
              </h3>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="text-sm text-secondary-600 mb-2 block">
                  Have a discount code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="w-full pl-9 pr-4 py-2.5 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-6 border-b border-secondary-200">
                <div className="flex items-center justify-between text-secondary-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-secondary-600">
                  <span>Delivery</span>
                  <span>
                    {totals.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(totals.shipping)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-secondary-600">
                  <span>Estimated {taxName}</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-6 border-b border-secondary-200">
                <span className="text-lg font-semibold text-secondary-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(totals.total)}
                </span>
              </div>

              {/* Free Shipping Progress */}
              {totals.subtotal < freeShippingThreshold && (
                <div className="my-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-secondary-600">
                      Add <span className="font-semibold text-primary-600">{formatPrice(freeShippingThreshold - totals.subtotal)}</span> more for free delivery
                    </span>
                    <Truck size={16} className="text-secondary-400" />
                  </div>
                  <div className="h-2 bg-secondary-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totals.subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/checkout')}
                className="mt-6"
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-center gap-2 text-secondary-500 text-sm">
                  <ShieldCheck size={18} className="text-green-500" />
                  <span>Secure Checkout</span>
                </div>
                
                {/* Payment Methods */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <div className="w-10 h-6 bg-secondary-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">VISA</span>
                  </div>
                  <div className="w-10 h-6 bg-secondary-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-red-500">MC</span>
                  </div>
                  <div className="w-10 h-6 bg-secondary-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-800">AMEX</span>
                  </div>
                  <div className="w-10 h-6 bg-secondary-100 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-500">PP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;