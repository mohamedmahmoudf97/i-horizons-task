import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { List, AutoSizer, ListRowProps } from 'react-virtualized';
import { Pokemon } from '../types';
import PokemonGridCard from './PokemonGridCard';

interface VirtualizedPokemonGridProps {
  pokemons: Pokemon[];
  favorites: number[];
  cardsPerRow: number;
  onSelectPokemon: (id: number) => void;
  onToggleFavorite: (id: number, event: React.MouseEvent) => void;
  onScroll: (params: { clientHeight: number, scrollHeight: number, scrollTop: number }) => void;
  listRef: React.RefObject<List | null>;
}

/**
 * VirtualizedPokemonGrid component renders a virtualized grid of Pokemon cards
 * for efficient rendering of large lists.
 */
const VirtualizedPokemonGrid: React.FC<VirtualizedPokemonGridProps> = ({
  pokemons,
  favorites,
  cardsPerRow: defaultCardsPerRow,
  onSelectPokemon,
  onToggleFavorite,
  onScroll,
  listRef
}) => {
  // State to track current cards per row based on screen size
  const [cardsPerRow, setCardsPerRow] = useState(defaultCardsPerRow);
  const [rowHeight, setRowHeight] = useState(220);

  // Memoize the resize handler to prevent unnecessary function recreation
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) { // sm
      setCardsPerRow(1);
      setRowHeight(200);
    } else if (width < 768) { // md
      setCardsPerRow(2);
      setRowHeight(210);
    } else if (width < 1024) { // lg
      setCardsPerRow(3);
      setRowHeight(220);
    } else if (width < 1280) { // xl
      setCardsPerRow(4);
      setRowHeight(220);
    } else { // 2xl
      setCardsPerRow(5);
      setRowHeight(220);
    }
  }, []);

  // Update cards per row based on window width
  useEffect(() => {
    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Memoize row count calculation to prevent recalculation on every render
  const rowCount = useMemo(() => 
    Math.ceil(pokemons.length / cardsPerRow), 
    [pokemons.length, cardsPerRow]
  );

  // Memoize the row renderer function
  const rowRenderer = useCallback(({ index, key, style }: ListRowProps) => {
    const startIdx = index * cardsPerRow;
    const pokemonsInRow = pokemons.slice(startIdx, startIdx + cardsPerRow);
    
    return (
      <div key={key} style={style} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        {pokemonsInRow.map(pokemon => {
          const isFavorite = favorites.includes(pokemon.id);
          
          return (
            <PokemonGridCard
              key={pokemon.id}
              pokemon={pokemon}
              isFavorite={isFavorite}
              onSelect={onSelectPokemon}
              onToggleFavorite={onToggleFavorite}
            />
          );
        })}
        
        {/* Fill empty slots with invisible placeholders to maintain grid layout */}
        {Array.from({ length: cardsPerRow - pokemonsInRow.length }).map((_, i) => (
          <div key={`empty-${i}`} className="flex-1 invisible" />
        ))}
      </div>
    );
  }, [pokemons, cardsPerRow, favorites, onSelectPokemon, onToggleFavorite]);

  return (
    <div className="h-[65vh] w-full" data-testid="pokemon-list">
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            onScroll={onScroll}
            overscanRowCount={5}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedPokemonGrid;
