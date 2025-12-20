import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { ConfirmModal } from '../common/Modal';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { formatPrice } = useSettings();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity < 1) {
      setShowConfirm(true);
      return;
    }
    
    // Check stock
    if (newQuantity > item.stock) {
      // Could show a toast here
      return;
    }

    setIsUpdating(true);
    // Simulate slight delay for better UX
    setTimeout(() => {
      updateQuantity(item.id, item.size, item.color, newQuantity);
      setIsUpdating(false);
    }, 200);
  };

  const handleRemove = () => {
    removeFromCart(item.id, item.size, item.color);
    setShowConfirm(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-secondary-100 transition-all duration-300 hover:shadow-md">
        {/* Image */}
        <Link 
          to={`/product/${item.id}`} 
          className="relative flex-shrink-0 w-full sm:w-28 aspect-[3/4] sm:aspect-square rounded-lg overflow-hidden group"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link 
                to={`/product/${item.id}`}
                className="font-semibold text-secondary-900 hover:text-primary-600 transition-colors duration-300 line-clamp-2"
              >
                {item.name}
              </Link>
              
              <div className="mt-1 flex flex-wrap gap-2 text-sm text-secondary-500">
                <span className="flex items-center gap-1">
                  Size: <span className="font-medium text-secondary-900">{item.size}</span>
                </span>
                <span className="w-px h-4 bg-secondary-300 hidden sm:block"></span>
                <span className="flex items-center gap-1">
                  Colour: 
                  <span 
                    className="w-3 h-3 rounded-full border border-secondary-200 inline-block ml-1" 
                    style={{ backgroundColor: item.color.toLowerCase() }}
                  />
                  <span className="font-medium text-secondary-900">{item.color}</span>
                </span>
              </div>
            </div>

            {/* Remove Button (Desktop) */}
            <button
              onClick={() => setShowConfirm(true)}
              className="hidden sm:block text-secondary-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
              aria-label="Remove item"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <label htmlFor={`qty-${item.id}`} className="sr-only">Quantity</label>
              <div className="flex items-center border border-secondary-200 rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  className="p-2 hover:bg-secondary-50 text-secondary-600 disabled:opacity-50 transition-colors"
                  disabled={isUpdating}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <div className="w-10 text-center font-medium text-secondary-900">
                  {item.quantity}
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  className="p-2 hover:bg-secondary-50 text-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={isUpdating || item.quantity >= item.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {item.stock < 10 && (
                <span className="text-xs text-orange-500 font-medium">
                  Only {item.stock} left
                </span>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="font-bold text-lg text-secondary-900">
                {formatPrice(item.price * item.quantity)}
              </div>
              {item.quantity > 1 && (
                <div className="text-xs text-secondary-500">
                  {formatPrice(item.price)} each
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Remove Button (Mobile) */}
        <button
          onClick={() => setShowConfirm(true)}
          className="sm:hidden flex items-center justify-center gap-2 w-full py-2 mt-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
        >
          <Trash2 size={16} />
          <span>Remove</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleRemove}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        variant="danger"
      />
    </>
  );
};

export default CartItem;