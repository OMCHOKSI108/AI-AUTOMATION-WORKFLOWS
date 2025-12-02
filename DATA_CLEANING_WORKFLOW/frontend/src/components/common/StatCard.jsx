import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Download } from 'lucide-react';

const StatCard = ({ title, value, change, changeType, icon: Icon, trend }) => {
  const iconColors = {
    primary: 'bg-blue-50 text-blue-600 border border-blue-100',
    success: 'bg-green-50 text-green-600 border border-green-100',
    warning: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
    danger: 'bg-red-50 text-red-600 border border-red-100',
    info: 'bg-cyan-50 text-cyan-600 border border-cyan-100',
  };

  const cardColors = {
    primary: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
    success: 'border-green-200 hover:border-green-300 hover:shadow-green-100',
    warning: 'border-yellow-200 hover:border-yellow-300 hover:shadow-yellow-100',
    danger: 'border-red-200 hover:border-red-300 hover:shadow-red-100',
    info: 'border-cyan-200 hover:border-cyan-300 hover:shadow-cyan-100',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 border-r border-t border-b p-4 sm:p-6 hover:shadow-lg transition-all duration-200 ${cardColors[changeType] || cardColors.primary}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`p-2.5 sm:p-3 rounded-lg ${iconColors[changeType] || iconColors.primary}`}>
          {Icon && <Icon size={20} className="sm:w-6 sm:h-6" />}
        </div>
        {trend && (
          <div className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 uppercase tracking-wide">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            <span className={`text-xs sm:text-sm font-semibold ${
              changeType === 'success' ? 'text-green-600' : 
              changeType === 'danger' ? 'text-red-600' : 
              changeType === 'warning' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
