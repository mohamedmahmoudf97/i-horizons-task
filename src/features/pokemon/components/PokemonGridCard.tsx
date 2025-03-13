import React from 'react';
import Image from 'next/image';
import { Pokemon } from '../types';

interface PokemonGridCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number, event: React.MouseEvent) => void;
}

/**
 * PokemonGridCard component displays an individual Pokemon card in the grid view
 * with image, name, ID, and favorite toggle functionality.
 */
const PokemonGridCard: React.FC<PokemonGridCardProps> = ({
  pokemon,
  isFavorite,
  onSelect,
  onToggleFavorite
}) => {
  return (
    <div 
      key={pokemon.id} 
      className="mb-4 w-full sm:flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 "
      onClick={() => onSelect(pokemon.id)}
      data-testid={`pokemon-card-${pokemon.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base sm:text-lg font-semibold capitalize truncate">{pokemon.name}</h3>
        <button 
          onClick={(e) => onToggleFavorite(pokemon.id, e)}
          className="text-xl focus:outline-none ml-2"
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
          className="object-contain w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
          priority={pokemon.id <= 20} // Prioritize loading for visible cards
        />
      </div>
      <div className=" text-center">
        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">#{pokemon.id.toString().padStart(3, '0')}</span>
      </div>
    </div>
  );
};

export default PokemonGridCard;
