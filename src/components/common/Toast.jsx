import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast types configuration
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    iconColor: 'text-green-500',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    iconColor: 'text-red-500',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-800',
    messageColor: 'text-yellow-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700'
  }
};

// Single Toast Component
const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm p-4 rounded-lg shadow-lg border-l-4
        ${config.bgColor} ${config.borderColor}
        ${isExiting ? 'toast-exit' : 'toast-enter'}
        transform transition-all duration-300
      `}
      role="alert"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${config.iconColor}`}>
        <Icon size={24} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold ${config.titleColor}`}>
            {title}
          </p>
        )}
        {message && (
          <p className={`text-sm mt-1 ${config.messageColor}`}>
            {message}
          </p>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`
          flex-shrink-0 p-1 rounded-full transition-colors duration-200
          hover:bg-black hover:bg-opacity-10
          ${config.iconColor}
        `}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast, position = 'top-right' }) => {
  // Position styles
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={`
        fixed z-50 flex flex-col gap-3
        ${positions[position]}
      `}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  // Generate unique ID
  const generateId = () => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add toast
  const addToast = useCallback((options) => {
    const id = generateId();
    const newToast = {
      id,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message || '',
      duration: options.duration !== undefined ? options.duration : 5000
    };

    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, newToast];
      // Limit the number of toasts
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(-maxToasts);
      }
      return updatedToasts;
    });

    return id;
  }, [maxToasts]);

  // Remove toast
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = {
    success: (message, title = 'Success', duration) => 
      addToast({ type: 'success', title, message, duration }),
    error: (message, title = 'Error', duration) => 
      addToast({ type: 'error', title, message, duration }),
    warning: (message, title = 'Warning', duration) => 
      addToast({ type: 'warning', title, message, duration }),
    info: (message, title = 'Info', duration) => 
      addToast({ type: 'info', title, message, duration }),
    custom: (options) => addToast(options),
    remove: removeToast,
    clear: clearToasts
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        position={position}
      />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;