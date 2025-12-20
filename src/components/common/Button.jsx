import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-800 text-white hover:bg-secondary-900 active:bg-secondary-950 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
    outlineSecondary: 'border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white focus:ring-secondary-500',
    ghost: 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-800 focus:ring-secondary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-500',
    link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500',
    white: 'bg-white text-secondary-800 hover:bg-secondary-50 focus:ring-secondary-500 shadow-md'
  };

  // Size styles
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
    xl: 'px-10 py-5 text-xl gap-3'
  };

  // Icon sizes
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24
  };

  // Combine styles
  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // Render icon
  const renderIcon = (position) => {
    if (loading && position === 'left') {
      return <Loader2 size={iconSizes[size]} className="animate-spin" />;
    }
    if (Icon && iconPosition === position) {
      return <Icon size={iconSizes[size]} />;
    }
    return null;
  };

  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {renderIcon('left')}
      {children}
      {renderIcon('right')}
    </button>
  );
};

// Icon-only button variant
export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ariaLabel,
  onClick,
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-800 text-white hover:bg-secondary-900 focus:ring-secondary-500',
    ghost: 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-800 focus:ring-secondary-500',
    danger: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
    success: 'text-green-600 hover:bg-green-50 focus:ring-green-500'
  };

  // Size styles
  const sizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  };

  // Icon sizes
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();

  return (
    <button
      type="button"
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        <Icon size={iconSizes[size]} />
      )}
    </button>
  );
};

export default Button;