import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StatCard = ({ title, value, icon, change, positive, color, subtext }) => {
  // Ensure value is always a valid string or number
  const displayValue = value ?? '0';
  // Format numbers with commas if the value is a number
  const formattedValue = typeof displayValue === 'number' ? 
    displayValue.toLocaleString() : displayValue;

  return (
    <div className={`p-6 rounded-2xl shadow-lg ${color}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-white/80">{title}</p>
          <p className="text-2xl font-bold text-white">{formattedValue}</p>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              <span className={`text-sm ${positive ? 'text-green-300' : 'text-red-300'}`}>
                {positive ? '+' : ''}{change}%
              </span>
              <span className="text-white/60 text-sm">vs last month</span>
            </div>
          )}
          {subtext && (
            <p className="text-sm text-white/60">{subtext}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;