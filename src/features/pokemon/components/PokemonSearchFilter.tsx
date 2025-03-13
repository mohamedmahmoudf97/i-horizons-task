import React, { useState } from 'react';

export interface FilterOptions {
  minHeight?: number;
  maxHeight?: number;
  minWeight?: number;
  maxWeight?: number;
  abilities: string[];
}

interface PokemonSearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  availableAbilities: string[];
}

const PokemonSearchFilter: React.FC<PokemonSearchFilterProps> = ({
  onSearchChange,
  onFilterChange,
  availableAbilities,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    minHeight: undefined,
    maxHeight: undefined,
    minWeight: undefined,
    maxWeight: undefined,
    abilities: [],
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'abilities') {
      // Handle multi-select for abilities
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value);
      
      setFilters(prev => ({
        ...prev,
        abilities: selectedOptions,
      }));
    } else {
      // Handle number inputs for height and weight
      const numValue = value === '' ? undefined : Number(value);
      
      setFilters(prev => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const resetFilters = {
      minHeight: undefined,
      maxHeight: undefined,
      minWeight: undefined,
      maxWeight: undefined,
      abilities: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="mb-6 space-y-4" data-testid="search-filter-container">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search Pokémon by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            data-testid="search-input"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          data-testid="toggle-filters-button"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-900 p-4 rounded-md space-y-4" data-testid="filters-panel">
          <h3 className="font-semibold text-lg">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Height (dm)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minHeight"
                  placeholder="Min"
                  value={filters.minHeight || ''}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="min-height-input"
                />
                <input
                  type="number"
                  name="maxHeight"
                  placeholder="Max"
                  value={filters.maxHeight || ''}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="max-height-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Weight (hg)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minWeight"
                  placeholder="Min"
                  value={filters.minWeight || ''}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="min-weight-input"
                />
                <input
                  type="number"
                  name="maxWeight"
                  placeholder="Max"
                  value={filters.maxWeight || ''}
                  onChange={handleFilterChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="max-weight-input"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Abilities</label>
            <div className="grid grid-cols-8 gap-2  p-2 border border-gray-300 rounded-md bg-gray-800" data-testid="abilities-container">
              {availableAbilities.map(ability => (
                <div key={ability} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`ability-${ability}`}
                    name="ability"
                    value={ability}
                    checked={filters.abilities.includes(ability)}
                    onChange={(e) => {
                      const value = e.target.value;
                      const isChecked = e.target.checked;
                      
                      setFilters(prev => ({
                        ...prev,
                        abilities: isChecked
                          ? [...prev.abilities, value]
                          : prev.abilities.filter(a => a !== value)
                      }));
                    }}
                    className="mr-2"
                    data-testid={`ability-checkbox-${ability}`}
                  />
                  <label htmlFor={`ability-${ability}`} className="text-sm capitalize">
                    {ability.replace('-', ' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              data-testid="reset-filters-button"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              data-testid="apply-filters-button"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonSearchFilter;
