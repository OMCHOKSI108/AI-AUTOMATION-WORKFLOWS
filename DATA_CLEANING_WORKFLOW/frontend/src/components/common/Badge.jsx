import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  rounded = 'full',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-[#ff9900] text-[#232f3e]',
    success: 'bg-[#067d62] text-white',
    warning: 'bg-[#ff9900] text-[#232f3e]',
    danger: 'bg-[#d13212] text-white',
    info: 'bg-[#007eb9] text-white',
    purple: 'bg-purple-100 text-purple-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };
  
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  
  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${roundedStyles[rounded]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
