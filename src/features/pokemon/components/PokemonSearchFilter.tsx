import React, { useState } from 'react';
import { FilterOptions } from '../types';
import SearchInput from './filters/SearchInput';
import HeightFilter from './filters/HeightFilter';
import WeightFilter from './filters/WeightFilter';
import AbilitiesFilter from './filters/AbilitiesFilter';
import FilterControls from './filters/FilterControls';

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

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm);
  };

  const handleNumberFilterChange = (name: string, value: number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAbilitiesChange = (abilities: string[]) => {
    setFilters(prev => ({
      ...prev,
      abilities,
    }));
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
    <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 px-2 sm:px-0" data-testid="search-filter-container">
      <div className="flex flex-col sm:flex-row gap-2">
        <SearchInput 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          data-testid="toggle-filters-button"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-900 p-3 sm:p-4 rounded-md space-y-3 sm:space-y-4" data-testid="filters-panel">
          <h3 className="font-semibold text-base sm:text-lg">Filters</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <HeightFilter 
              minHeight={filters.minHeight} 
              maxHeight={filters.maxHeight} 
              onChange={handleNumberFilterChange} 
            />
            
            <WeightFilter 
              minWeight={filters.minWeight} 
              maxWeight={filters.maxWeight} 
              onChange={handleNumberFilterChange} 
            />
          </div>
          
          <AbilitiesFilter 
            selectedAbilities={filters.abilities} 
            availableAbilities={availableAbilities} 
            onChange={handleAbilitiesChange} 
          />
          
          <FilterControls 
            onApply={applyFilters} 
            onReset={resetFilters} 
          />
        </div>
      )}
    </div>
  );
};

export default PokemonSearchFilter;
