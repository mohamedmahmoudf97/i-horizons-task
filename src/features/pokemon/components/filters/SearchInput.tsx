import React from 'react';

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, onSearchChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex-grow">
      <input
        type="text"
        placeholder="Search Pokémon by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="search-input"
      />
    </div>
  );
};

export default SearchInput;
