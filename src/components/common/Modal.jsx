import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer = null,
  className = ''
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Size styles
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div
        className={`
          relative bg-white rounded-xl shadow-2xl w-full mx-4
          transform transition-all duration-300 animate-slide-up
          ${sizes[size]}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-secondary-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <IconButton
                icon={X}
                variant="ghost"
                size="sm"
                onClick={onClose}
                ariaLabel="Close modal"
                className="ml-auto -mr-2"
              />
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) => {
  const buttonVariants = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    primary: 'bg-primary-600 hover:bg-primary-700 text-white'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-secondary-700 hover:bg-secondary-100 rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg transition-colors duration-300 
              disabled:opacity-50 flex items-center gap-2
              ${buttonVariants[variant]}
            `}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-secondary-600">{message}</p>
    </Modal>
  );
};

// Image Preview Modal
export const ImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt = 'Preview'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      showCloseButton={true}
      className="bg-transparent shadow-none"
    >
      <div className="flex items-center justify-center">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </Modal>
  );
};

export default Modal;