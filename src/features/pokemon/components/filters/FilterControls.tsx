import React from 'react';

interface FilterControlsProps {
  onApply: () => void;
  onReset: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onApply, onReset }) => {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={onReset}
        className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
        data-testid="reset-filters-button"
      >
        Reset
      </button>
      <button
        onClick={onApply}
        className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        data-testid="apply-filters-button"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterControls;
