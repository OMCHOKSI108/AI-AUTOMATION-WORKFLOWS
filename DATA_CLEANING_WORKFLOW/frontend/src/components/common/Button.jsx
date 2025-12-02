import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#ff9900] text-[#232f3e] hover:bg-[#e68a00] focus:ring-[#ff9900] shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-[#ff9900]',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-[#007185] hover:text-[#005a6c] underline-offset-4 hover:underline focus:ring-[#007185]',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={iconSizes[size]} />
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="mr-2" size={iconSizes[size]} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="ml-2" size={iconSizes[size]} />}
        </>
      )}
    </button>
  );
};

export default Button;
