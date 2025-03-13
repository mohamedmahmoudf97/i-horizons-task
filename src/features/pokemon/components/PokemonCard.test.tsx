import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonCard from './PokemonCard';
import { Pokemon } from '../types';

describe('PokemonCard', () => {
  const mockPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/'
  };

  const mockOnClick = jest.fn();
  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Pokemon card correctly', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Check if the Pokemon name is displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    
    // Check if the Pokemon ID is displayed
    expect(screen.getByText('#001')).toBeInTheDocument();
    
    // Check if the favorite button is displayed
    expect(screen.getByTestId(`favorite-button-${mockPokemon.id}`)).toBeInTheDocument();
    
    // Check if the image is displayed with the correct alt text
    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Click on the card
    fireEvent.click(screen.getByTestId(`pokemon-card-${mockPokemon.id}`));
    
    // Check if onClick was called with the correct Pokemon ID
    expect(mockOnClick).toHaveBeenCalledWith(mockPokemon.id);
  });

  it('calls onToggleFavorite when the favorite button is clicked', () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Click on the favorite button
    fireEvent.click(screen.getByTestId(`favorite-button-${mockPokemon.id}`));
    
    // Check if onToggleFavorite was called with the correct Pokemon ID
    expect(mockOnToggleFavorite).toHaveBeenCalled();
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('displays the correct favorite icon based on the isFavorite prop', () => {
    const { rerender } = render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Check if the not-favorite icon is displayed
    const favoriteButton = screen.getByTestId(`favorite-button-${mockPokemon.id}`);
    expect(favoriteButton).toHaveTextContent('🤍');

    // Re-render with isFavorite=true
    rerender(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={true}
        onClick={mockOnClick}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    // Check if the favorite icon is displayed
    expect(favoriteButton).toHaveTextContent('❤️');
  });
});
