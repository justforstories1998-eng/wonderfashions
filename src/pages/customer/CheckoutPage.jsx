import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import CheckoutForm from '../../components/customer/CheckoutForm';
import { MiniHero } from '../../components/customer/Hero';
import Button from '../../components/common/Button';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalItems } = useCart();
  const { calculateOrderTotals } = useOrders();
  const { formatPrice, settings, getTaxName } = useSettings();

  // Get settings values
  const taxName = getTaxName() || 'VAT';
  const taxRate = settings?.tax?.rate || 0.20;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Calculate totals
  const totals = calculateOrderTotals(cart, settings?.shipping?.standardShippingCost || 4.99);

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <MiniHero 
        title="Checkout" 
        subtitle="Complete your order"
        breadcrumbs={[
          { name: 'Basket', path: '/cart' },
          { name: 'Checkout', path: '/checkout' }
        ]}
      />

      <div className="container-custom py-12">
        {/* Back to Cart */}
        <div className="mb-8">
          <Link to="/cart">
            <Button variant="ghost" icon={ArrowLeft} size="sm">
              Back to Basket
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1">
            <CheckoutForm />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center justify-between">
                Order Summary
                <span className="text-sm font-normal text-secondary-500">
                  {totalItems} item{totalItems > 1 ? 's' : ''}
                </span>
              </h3>

              {/* Cart Items Preview */}
              <div className="max-h-64 overflow-y-auto mb-6 space-y-4 pr-2">
                {cart.map((item, index) => (
                  <div 
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-secondary-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-secondary-500">
                        {item.size} / {item.color}
                      </p>
                      <p className="text-sm font-medium text-secondary-900 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-secondary-200 my-6" />

              {/* Price Breakdown */}
              <div className="space-y-3">
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
                  <span>{taxName} ({(taxRate * 100).toFixed(0)}%)</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4 mt-4 border-t border-secondary-200">
                <span className="text-lg font-semibold text-secondary-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(totals.total)}
                </span>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-secondary-500 text-sm">
                    <ShieldCheck size={18} className="text-green-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary-500 text-sm">
                    <Lock size={18} className="text-green-500" />
                    <span>Encrypted</span>
                  </div>
                </div>

                {/* Trust Message */}
                <p className="text-xs text-center text-secondary-400 mt-4">
                  Your personal data will be used to process your order and support your experience throughout this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;