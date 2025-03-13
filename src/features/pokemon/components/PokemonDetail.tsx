import React from 'react';
import Image from 'next/image';
import { PokemonDetail as PokemonDetailType } from '../types';

interface PokemonDetailProps {
  pokemon: PokemonDetailType | null;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onBack,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]" data-testid="detail-loading">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-3 sm:p-4" data-testid="detail-error">
        <p className="text-sm sm:text-base">Error: {error}</p>
        <button 
          onClick={onBack}
          className="mt-3 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to List
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="text-center p-3 sm:p-4" data-testid="detail-empty">
        <p className="text-sm sm:text-base">No Pokémon selected.</p>
        <button 
          onClick={onBack}
          className="mt-3 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6" data-testid="pokemon-detail">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button 
          onClick={onBack}
          className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          data-testid="back-button"
        >
          ← Back
        </button>
        <button 
          onClick={() => onToggleFavorite(pokemon.id)}
          className="text-xl sm:text-2xl focus:outline-none"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-testid="detail-favorite-button"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 flex justify-center">
          <Image
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            width={300}
            height={300}
            className="object-contain w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72"
            priority
          />
        </div>
        
        <div className="w-full sm:w-1/2 mt-4 sm:mt-0 sm:pl-4">
          <div className="text-center sm:text-left mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize mb-1 sm:mb-2">{pokemon.name}</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">#{pokemon.id.toString().padStart(3, '0')}</p>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Types</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map(({ type }) => (
                <span 
                  key={type.name}
                  className="px-2 py-1 text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded capitalize"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Height</h2>
              <p className="text-sm sm:text-base">{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Weight</h2>
              <p className="text-sm sm:text-base">{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Abilities</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <span 
                  key={ability.name}
                  className={`px-2 py-1 text-xs sm:text-sm rounded capitalize ${
                    is_hidden 
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100' 
                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                  }`}
                >
                  {ability.name.replace('-', ' ')}
                  {is_hidden && ' (Hidden)'}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Base Stats</h2>
            <div className="space-y-2">
              {pokemon.stats.map(stat => (
                <div key={stat.stat.name} className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs sm:text-sm capitalize">{stat.stat.name.replace('-', ' ')}</span>
                    <span className="text-xs sm:text-sm">{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                    <div 
                      className="bg-blue-500 h-2 sm:h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
