import React from 'react';

interface ErrorMessageProps {
  message?: string;
}

/**
 * ErrorMessage component displays an error message
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Error: Failed to load Pokemon list' 
}) => {
  return (
    <div className="text-center text-red-500 py-6 sm:py-8" data-testid="error-message">
      <p className="text-sm sm:text-base">{message}</p>
    </div>
  );
};

export default ErrorMessage;
