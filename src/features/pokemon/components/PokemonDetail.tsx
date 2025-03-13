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
      <div className="flex justify-center items-center min-h-[400px]" data-testid="detail-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4" data-testid="detail-error">
        <p>Error: {error}</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to List
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="text-center p-4" data-testid="detail-empty">
        <p>No Pokémon selected.</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6" data-testid="pokemon-detail">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          data-testid="back-button"
        >
          ← Back
        </button>
        <button 
          onClick={() => onToggleFavorite(pokemon.id)}
          className="text-2xl focus:outline-none"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-testid="detail-favorite-button"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            width={300}
            height={300}
            className="object-contain"
            priority
          />
        </div>
        
        <div className="md:w-1/2 mt-6 md:mt-0">
          <div className="text-center md:text-left mb-6">
            <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">#{pokemon.id.toString().padStart(3, '0')}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Types</h2>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map(({ type }) => (
                <span 
                  key={type.name}
                  className="px-3 py-1 rounded-full text-white bg-blue-500"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Height</h2>
              <p>{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Weight</h2>
              <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Abilities</h2>
            <ul className="list-disc list-inside">
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <li key={ability.name} className="capitalize">
                  {ability.name} {is_hidden && <span className="text-sm text-gray-500">(Hidden)</span>}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Stats</h2>
            {pokemon.stats.map(({ stat, base_stat }) => (
              <div key={stat.name} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="capitalize">{stat.name.replace('-', ' ')}</span>
                  <span>{base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (base_stat / 255) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
