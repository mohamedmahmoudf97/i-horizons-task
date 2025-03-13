import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonList from './PokemonList';
import { Pokemon } from '../types';

describe('PokemonList', () => {
  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    },
    {
      id: 2,
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/'
    },
    {
      id: 3,
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/'
    }
  ];

  const mockFavorites = [1, 3];
  const mockOnSelectPokemon = jest.fn();
  const mockOnToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state correctly', () => {
    render(
      <PokemonList
        pokemons={[]}
        favorites={[]}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('renders the error state correctly', () => {
    const errorMessage = 'Failed to load Pokemon';
    
    render(
      <PokemonList
        pokemons={[]}
        favorites={[]}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={false}
        error={errorMessage}
      />
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders the empty state correctly', () => {
    render(
      <PokemonList
        pokemons={[]}
        favorites={[]}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('empty-list')).toBeInTheDocument();
    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('renders the list of Pokemon correctly', () => {
    render(
      <PokemonList
        pokemons={mockPokemons}
        favorites={mockFavorites}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    
    // Check if all Pokemon names are displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('venusaur')).toBeInTheDocument();
    
    // Check if the correct number of Pokemon cards are rendered
    expect(screen.getAllByTestId(/^pokemon-card-/)).toHaveLength(3);
  });

  it('passes the correct favorite status to each Pokemon card', () => {
    render(
      <PokemonList
        pokemons={mockPokemons}
        favorites={mockFavorites}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={false}
      />
    );
    
    // Check if the favorite buttons have the correct content
    const favoriteButton1 = screen.getByTestId('favorite-button-1');
    const favoriteButton2 = screen.getByTestId('favorite-button-2');
    const favoriteButton3 = screen.getByTestId('favorite-button-3');
    
    expect(favoriteButton1).toHaveTextContent('❤️'); // Should be favorite
    expect(favoriteButton2).toHaveTextContent('🤍'); // Should not be favorite
    expect(favoriteButton3).toHaveTextContent('❤️'); // Should be favorite
  });

  it('calls onSelectPokemon when a Pokemon card is clicked', () => {
    render(
      <PokemonList
        pokemons={mockPokemons}
        favorites={mockFavorites}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={false}
      />
    );
    
    // Click on the first Pokemon card
    fireEvent.click(screen.getByTestId('pokemon-card-1'));
    
    // Check if onSelectPokemon was called with the correct Pokemon ID
    expect(mockOnSelectPokemon).toHaveBeenCalledWith(1);
  });

  it('calls onToggleFavorite when a favorite button is clicked', () => {
    render(
      <PokemonList
        pokemons={mockPokemons}
        favorites={mockFavorites}
        onSelectPokemon={mockOnSelectPokemon}
        onToggleFavorite={mockOnToggleFavorite}
        isLoading={false}
      />
    );
    
    // Click on the favorite button of the first Pokemon
    fireEvent.click(screen.getByTestId('favorite-button-1'));
    
    // Check if onToggleFavorite was called
    expect(mockOnToggleFavorite).toHaveBeenCalled();
    expect(mockOnSelectPokemon).not.toHaveBeenCalled();
  });
});
