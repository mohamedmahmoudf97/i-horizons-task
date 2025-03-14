import React from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
}

/**
 * LoadingIndicator component displays a spinning loading animation
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large' }) => {
  const dimensions = size === 'large' ? 'h-8 w-8 sm:h-12 sm:w-12' : 'h-6 w-6 sm:h-8 sm:w-8';
  
  return (
    <div className={`animate-spin rounded-full ${dimensions} border-t-2 border-b-2 border-blue-500`} />
  );
};

export default LoadingIndicator;
