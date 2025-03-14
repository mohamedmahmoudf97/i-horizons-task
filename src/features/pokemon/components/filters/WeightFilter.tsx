import React from 'react';

interface WeightFilterProps {
  minWeight: number | undefined;
  maxWeight: number | undefined;
  onChange: (name: string, value: number | undefined) => void;
}

const WeightFilter: React.FC<WeightFilterProps> = ({ minWeight, maxWeight, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value === '' ? undefined : Number(value));
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium">Weight (hg)</label>
      <div className="flex gap-2">
        <input
          type="number"
          name="minWeight"
          placeholder="Min"
          value={minWeight || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md"
          data-testid="min-weight-input"
        />
        <input
          type="number"
          name="maxWeight"
          placeholder="Max"
          value={maxWeight || ''}
          onChange={handleChange}
          min="0"
          className="w-full px-2 sm:px-3 py-1 sm:py-2 text-sm border border-gray-300 rounded-md"
          data-testid="max-weight-input"
        />
      </div>
    </div>
  );
};

export default WeightFilter;
