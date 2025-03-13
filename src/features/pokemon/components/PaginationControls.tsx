import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

/**
 * PaginationControls component provides navigation controls for paginated content
 * with previous/next buttons and page information.
 */
const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  onPreviousPage,
  onNextPage
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-2 sm:px-4 gap-3 sm:gap-0">
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 0}
        className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
          currentPage > 0
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        data-testid="previous-button"
      >
        Previous
      </button>
      
      <div className="text-center text-sm sm:text-base">
        <span data-testid="pagination-info">
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>
      
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
          hasNextPage
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        data-testid="next-button"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
