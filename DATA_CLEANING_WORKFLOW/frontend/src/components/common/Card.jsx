import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  action,
  hover = false,
  hoverable = false,
  icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  ...props 
}) => {
  const isHoverable = hover || hoverable;
  
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
        ${isHoverable ? 'transition-all duration-200 hover:shadow-lg hover:border-blue-200' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || action || icon) && (
        <div className={`px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white ${headerClassName}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {icon && (
                <div className="flex-shrink-0 mt-0.5">
                  {React.createElement(icon, { className: 'h-5 w-5 text-blue-600' })}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{title}</h3>}
                {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
      )}
      <div className={`px-4 sm:px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
