import React from 'react';
import LoadingIndicator from './LoadingIndicator';

/**
 * FullPageLoading component displays a centered loading indicator for the entire page
 */
const FullPageLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-48 sm:h-64" data-testid="loading-indicator">
      <LoadingIndicator size="large" />
    </div>
  );
};

export default FullPageLoading;
