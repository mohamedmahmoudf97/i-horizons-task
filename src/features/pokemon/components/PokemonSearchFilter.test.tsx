import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonSearchFilter from './PokemonSearchFilter';

describe('PokemonSearchFilter', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockAvailableAbilities = ['overgrow', 'chlorophyll', 'blaze', 'solar-power'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search input', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Pokémon by name...')).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'bulba' } });

    expect(mockOnSearchChange).toHaveBeenCalledWith('bulba');
  });

  it('toggles filter panel visibility when button is clicked', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    // Filter panel should be hidden initially
    expect(screen.queryByTestId('filters-panel')).not.toBeInTheDocument();

    // Click the toggle button
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Filter panel should be visible
    expect(screen.getByTestId('filters-panel')).toBeInTheDocument();

    // Click the toggle button again
    fireEvent.click(toggleButton);

    // Filter panel should be hidden again
    expect(screen.queryByTestId('filters-panel')).not.toBeInTheDocument();
  });

  it('renders all filter inputs when filter panel is visible', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    // Show the filter panel
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Check if all filter inputs are rendered
    expect(screen.getByTestId('min-height-input')).toBeInTheDocument();
    expect(screen.getByTestId('max-height-input')).toBeInTheDocument();
    expect(screen.getByTestId('min-weight-input')).toBeInTheDocument();
    expect(screen.getByTestId('max-weight-input')).toBeInTheDocument();
    expect(screen.getByTestId('abilities-container')).toBeInTheDocument();
  });

  it('displays all available abilities as checkboxes', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    // Show the filter panel
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Check if all abilities are displayed as checkboxes
    mockAvailableAbilities.forEach(ability => {
      expect(screen.getByTestId(`ability-checkbox-${ability}`)).toBeInTheDocument();
      expect(screen.getByText(ability.replace('-', ' '))).toBeInTheDocument();
    });
  });

  it('updates abilities filter when checkboxes are clicked', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    // Show the filter panel
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Click on ability checkboxes
    const overgrowCheckbox = screen.getByTestId('ability-checkbox-overgrow');
    const blazeCheckbox = screen.getByTestId('ability-checkbox-blaze');
    
    fireEvent.click(overgrowCheckbox);
    fireEvent.click(blazeCheckbox);

    // Apply filters
    const applyButton = screen.getByTestId('apply-filters-button');
    fireEvent.click(applyButton);

    // Check if onFilterChange was called with the selected abilities
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        abilities: ['overgrow', 'blaze'],
      })
    );
  });

  it('calls onFilterChange when Apply Filters button is clicked', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    // Show the filter panel
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Set some filter values
    fireEvent.change(screen.getByTestId('min-height-input'), { target: { value: '7' } });
    fireEvent.change(screen.getByTestId('max-weight-input'), { target: { value: '100' } });

    // Click the apply button
    const applyButton = screen.getByTestId('apply-filters-button');
    fireEvent.click(applyButton);

    // Check if onFilterChange was called with the correct filters
    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        minHeight: 7,
        maxWeight: 100,
      })
    );
  });

  it('resets filters when Reset button is clicked', () => {
    render(
      <PokemonSearchFilter
        onSearchChange={mockOnSearchChange}
        onFilterChange={mockOnFilterChange}
        availableAbilities={mockAvailableAbilities}
      />
    );

    // Show the filter panel
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Set some filter values
    fireEvent.change(screen.getByTestId('min-height-input'), { target: { value: '7' } });
    fireEvent.change(screen.getByTestId('max-weight-input'), { target: { value: '100' } });
    
    // Select some abilities
    const overgrowCheckbox = screen.getByTestId('ability-checkbox-overgrow');
    fireEvent.click(overgrowCheckbox);

    // Click the reset button
    const resetButton = screen.getByTestId('reset-filters-button');
    fireEvent.click(resetButton);

    // Check if onFilterChange was called with reset filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      minHeight: undefined,
      maxHeight: undefined,
      minWeight: undefined,
      maxWeight: undefined,
      abilities: [],
    });

    // Check if the input fields are cleared
    expect(screen.getByTestId('min-height-input')).toHaveValue(null);
    expect(screen.getByTestId('max-weight-input')).toHaveValue(null);
    
    // Check if ability checkboxes are unchecked
    expect(screen.getByTestId('ability-checkbox-overgrow')).not.toBeChecked();
  });
});
