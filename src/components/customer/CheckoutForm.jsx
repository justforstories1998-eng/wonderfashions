import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();
  const { createOrderFromCart } = useOrders();
  const { formatPrice, settings, getTaxName } = useSettings();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    postcode: '',
    country: 'United Kingdom',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'county', 'postcode'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (paymentMethod === 'Credit Card') {
      if (!formData.cardName) newErrors.cardName = 'Required';
      if (!formData.cardNumber) newErrors.cardNumber = 'Required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Required';
      if (!formData.cvv) newErrors.cvv = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      // Scroll to top of form to see errors
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      // Prepare customer info
      const customerInfo = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: formData.county,
        zipCode: formData.postcode,
        country: formData.country
      };

      // Simulate API processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order
      const newOrder = createOrderFromCart(cart, customerInfo, paymentMethod);
      
      // Clear cart
      clearCart();

      // Show success message
      toast.success('Order placed successfully!');

      // Redirect to success page
      navigate('/checkout/success', { 
        state: { orderId: newOrder.id } 
      });

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</span>
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`input ${errors.firstName ? 'input-error' : ''}`}
              placeholder="John"
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`input ${errors.lastName ? 'input-error' : ''}`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? 'input-error' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`input ${errors.phone ? 'input-error' : ''}`}
              placeholder="+44 7123 456789"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">2</span>
          Shipping Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-1">
            <label className="label">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`input ${errors.address ? 'input-error' : ''}`}
              placeholder="123 Fashion Street, Flat 4B"
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">City / Town</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`input ${errors.city ? 'input-error' : ''}`}
              placeholder="London"
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="label">County</label>
              <input
                type="text"
                name="county"
                value={formData.county}
                onChange={handleInputChange}
                className={`input ${errors.county ? 'input-error' : ''}`}
                placeholder="Greater London"
              />
              {errors.county && <p className="text-red-500 text-xs">{errors.county}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Postcode</label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                className={`input ${errors.postcode ? 'input-error' : ''}`}
                placeholder="W1A 1AA"
              />
              {errors.postcode && <p className="text-red-500 text-xs">{errors.postcode}</p>}
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="label">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="input bg-white"
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="Ireland">Ireland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
              <option value="Italy">Italy</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h2 className="text-xl font-semibold mb-4 text-secondary-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">3</span>
          Payment Method
        </h2>

        {/* Payment Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('Credit Card')}
            className={`
              flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300
              ${paymentMethod === 'Credit Card'
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-secondary-100 hover:border-secondary-300 text-secondary-600'
              }
            `}
          >
            <CreditCard size={24} />
            <span className="font-medium text-sm">Credit Card</span>
            {paymentMethod === 'Credit Card' && <CheckCircle size={16} className="text-primary-600 mt-1" />}
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('PayPal')}
            className={`
              flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300
              ${paymentMethod === 'PayPal'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-secondary-100 hover:border-secondary-300 text-secondary-600'
              }
            `}
          >
            <Wallet size={24} />
            <span className="font-medium text-sm">PayPal</span>
            {paymentMethod === 'PayPal' && <CheckCircle size={16} className="text-blue-600 mt-1" />}
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('COD')}
            className={`
              flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300
              ${paymentMethod === 'COD'
                ? 'border-green-600 bg-green-50 text-green-700'
                : 'border-secondary-100 hover:border-secondary-300 text-secondary-600'
              }
            `}
          >
            <Truck size={24} />
            <span className="font-medium text-sm">Cash on Delivery</span>
            {paymentMethod === 'COD' && <CheckCircle size={16} className="text-green-600 mt-1" />}
          </button>
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'Credit Card' && (
          <div className="animate-fade-in space-y-4 border-t border-secondary-100 pt-6">
            <div className="space-y-1">
              <label className="label">Name on Card</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className={`input ${errors.cardName ? 'input-error' : ''}`}
                placeholder="John Doe"
              />
              {errors.cardName && <p className="text-red-500 text-xs">{errors.cardName}</p>}
            </div>

            <div className="space-y-1">
              <label className="label">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={`input pl-10 ${errors.cardNumber ? 'input-error' : ''}`}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                />
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="label">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={`input ${errors.expiryDate ? 'input-error' : ''}`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiryDate && <p className="text-red-500 text-xs">{errors.expiryDate}</p>}
              </div>

              <div className="space-y-1">
                <label className="label">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={`input ${errors.cvv ? 'input-error' : ''}`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv}</p>}
              </div>
            </div>
          </div>
        )}

        {/* PayPal Message */}
        {paymentMethod === 'PayPal' && (
          <div className="animate-fade-in p-4 bg-blue-50 text-blue-800 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              You will be redirected to PayPal to complete your purchase securely.
            </p>
          </div>
        )}

        {/* COD Message */}
        {paymentMethod === 'COD' && (
          <div className="animate-fade-in p-4 bg-green-50 text-green-800 rounded-lg flex items-start gap-3">
            <Truck size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Pay with cash upon delivery. Additional handling fee may apply.
            </p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
      >
        Place Order
      </Button>
    </form>
  );
};

export default CheckoutForm;