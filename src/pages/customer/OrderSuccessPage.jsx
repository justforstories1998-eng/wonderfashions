import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  ArrowRight,
  Home,
  ShoppingBag,
  Printer
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useOrders } from '../../context/OrderContext';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();

  // Get order ID from location state
  const orderId = location.state?.orderId;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect if no order ID
  useEffect(() => {
    if (!orderId) {
      // Give a slight delay for a smoother experience
      const timer = setTimeout(() => {
        navigate('/');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [orderId, navigate]);

  // Order timeline steps
  const timelineSteps = [
    {
      icon: CheckCircle,
      title: 'Order Confirmed',
      description: 'Your order has been placed successfully',
      status: 'completed'
    },
    {
      icon: Package,
      title: 'Processing',
      description: 'We are preparing your order',
      status: 'current'
    },
    {
      icon: Truck,
      title: 'Shipping',
      description: 'Your order is on its way',
      status: 'pending'
    },
    {
      icon: Home,
      title: 'Delivered',
      description: 'Package delivered to your address',
      status: 'pending'
    }
  ];

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-primary-500 text-white animate-pulse';
      default:
        return 'bg-secondary-200 text-secondary-400';
    }
  };

  const getLineColor = (status) => {
    return status === 'completed' ? 'bg-green-500' : 'bg-secondary-200';
  };

  if (!orderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 animate-bounce-slow">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
              Thank You for Your Order!
            </h1>
            
            <p className="text-lg text-secondary-600 max-w-md mx-auto">
              Your order has been placed successfully. We've sent a confirmation email with order details.
            </p>
          </div>

          {/* Order Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 md:p-8 mb-8">
            {/* Order Number */}
            <div className="text-center pb-6 border-b border-secondary-200">
              <p className="text-secondary-500 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-primary-600">#{orderId}</p>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-secondary-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center">
                  <Mail size={20} className="text-primary-600" />
                </div>
                <p className="text-sm text-secondary-500">Confirmation Email</p>
                <p className="font-medium text-secondary-900">Sent</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center">
                  <Package size={20} className="text-primary-600" />
                </div>
                <p className="text-sm text-secondary-500">Estimated Processing</p>
                <p className="font-medium text-secondary-900">1-2 Business Days</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center">
                  <Truck size={20} className="text-primary-600" />
                </div>
                <p className="text-sm text-secondary-500">Estimated Delivery</p>
                <p className="font-medium text-secondary-900">3-5 Business Days</p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="py-8">
              <h3 className="font-semibold text-secondary-900 mb-6 text-center">
                Order Status
              </h3>
              
              <div className="relative">
                {/* Timeline */}
                <div className="flex items-center justify-between">
                  {timelineSteps.map((step, index) => (
                    <React.Fragment key={index}>
                      {/* Step */}
                      <div className="flex flex-col items-center relative z-10">
                        <div 
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center mb-2
                            ${getStatusColor(step.status)}
                          `}
                        >
                          <step.icon size={20} />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-secondary-900 text-center">
                          {step.title}
                        </p>
                        <p className="text-xs text-secondary-500 text-center hidden sm:block max-w-[100px]">
                          {step.description}
                        </p>
                      </div>

                      {/* Connector Line */}
                      {index < timelineSteps.length - 1 && (
                        <div 
                          className={`
                            flex-1 h-1 mx-2 rounded-full
                            ${getLineColor(step.status)}
                          `}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-secondary-50 rounded-lg p-6">
              <h3 className="font-semibold text-secondary-900 mb-4">What's Next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">1</span>
                  </div>
                  <p className="text-secondary-600">
                    You will receive an email confirmation shortly at your registered email address.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">2</span>
                  </div>
                  <p className="text-secondary-600">
                    Once your order ships, we'll send you a tracking number to monitor your package.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-600">3</span>
                  </div>
                  <p className="text-secondary-600">
                    Need help? Our customer support team is available 24/7 to assist you.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop">
              <Button 
                variant="primary" 
                size="lg"
                icon={ShoppingBag}
              >
                Continue Shopping
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-secondary-500">
              Have questions about your order?{' '}
              <Link to="/contact" className="text-primary-600 hover:underline font-medium">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;