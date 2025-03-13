import React from 'react';
import { Pokemon } from '../types';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemons: Pokemon[];
  favorites: number[];
  onSelectPokemon: (id: number) => void;
  onToggleFavorite: (id: number, event: React.MouseEvent) => void;
  isLoading: boolean;
  error?: string;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  favorites,
  onSelectPokemon,
  onToggleFavorite,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]" data-testid="loading-indicator">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4" data-testid="error-message">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (pokemons.length === 0) {
    return (
      <div className="text-center p-4" data-testid="empty-list">
        <p>No Pokémon found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="pokemon-list">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={favorites.includes(pokemon.id)}
          onClick={onSelectPokemon}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default PokemonList;
