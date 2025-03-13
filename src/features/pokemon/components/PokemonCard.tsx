import React from 'react';
import Image from 'next/image';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onClick: (id: number) => void;
  onToggleFavorite: (id: number, event: React.MouseEvent) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isFavorite,
  onClick,
  onToggleFavorite,
}) => {
  const handleClick = () => {
    onClick(pokemon.id);
  };

  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onToggleFavorite(pokemon.id, event);
  };

  return (
    <div 
      onClick={handleClick}
      className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      data-testid={`pokemon-card-${pokemon.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
        <button 
          onClick={handleFavoriteClick}
          className="text-xl focus:outline-none"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-testid={`favorite-button-${pokemon.id}`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="flex justify-center">
        <Image
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
          alt={pokemon.name}
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">#{pokemon.id.toString().padStart(3, '0')}</span>
      </div>
    </div>
  );
};

export default PokemonCard;
