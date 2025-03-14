import React from 'react';

interface HeightFilterProps {
  minHeight: number | undefined;
  maxHeight: number | undefined;
  onChange: (name: string, value: number | undefined) => void;
}

const HeightFilter: React.FC<HeightFilterProps> = ({ minHeight, maxHeight, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value === '' ? undefined : Number(value));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium">Height (dm)</label>
      <div className="flex gap-2">
        <input
          type="number"
          name="minHeight"
          placeholder="Min"
          value={minHeight || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md"
          data-testid="min-height-input"
        />
        <input
          type="number"
          name="maxHeight"
          placeholder="Max"
          value={maxHeight || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md"
          data-testid="max-height-input"
        />
      </div>
    </div>
  );
};

export default HeightFilter;
