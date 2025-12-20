import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = null, 
  trendValue = '', 
  color = 'primary',
  loading = false
}) => {
  // Color variants
  const colors = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      iconBg: 'bg-primary-100'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      iconBg: 'bg-orange-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100'
    }
  };

  const currentColor = colors[color] || colors.primary;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
          <div className="w-10 h-10 bg-secondary-200 rounded-lg"></div>
        </div>
        <div className="h-8 bg-secondary-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-secondary-900">
            {value}
          </h3>
        </div>
        
        <div className={`p-3 rounded-lg ${currentColor.iconBg} ${currentColor.text}`}>
          <Icon size={24} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center mt-4">
          <span 
            className={`
              flex items-center text-sm font-medium mr-2
              ${trend === 'up' ? 'text-green-600' : 'text-red-600'}
            `}
          >
            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="ml-1">{trendValue}</span>
          </span>
          <span className="text-sm text-secondary-500">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;