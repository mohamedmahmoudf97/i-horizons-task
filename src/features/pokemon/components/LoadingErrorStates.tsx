import React from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
}

/**
 * LoadingIndicator component displays a spinning loading animation
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large' }) => {
  const dimensions = size === 'large' ? 'h-8 w-8 sm:h-12 sm:w-12' : 'h-6 w-6 sm:h-8 sm:w-8';
  
  return (
    <div className={`animate-spin rounded-full ${dimensions} border-t-2 border-b-2 border-blue-500`} />
  );
};

/**
 * FullPageLoading component displays a centered loading indicator for the entire page
 */
export const FullPageLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-48 sm:h-64" data-testid="loading-indicator">
      <LoadingIndicator size="large" />
    </div>
  );
};

interface ErrorMessageProps {
  message?: string;
}

/**
 * ErrorMessage component displays an error message
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Error: Failed to load Pokemon list' 
}) => {
  return (
    <div className="text-center text-red-500 py-6 sm:py-8" data-testid="error-message">
      <p className="text-sm sm:text-base">{message}</p>
    </div>
  );
};

/**
 * EmptyListMessage component displays a message when no items are found
 */
export const EmptyListMessage: React.FC = () => {
  return (
    <div className="text-center py-6 sm:py-8" data-testid="empty-list">
      <p className="text-sm sm:text-base">No Pokémon found.</p>
    </div>
  );
};
