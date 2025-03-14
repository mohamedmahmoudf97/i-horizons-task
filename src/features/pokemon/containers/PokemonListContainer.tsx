'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../../store/pokemonSlice';
import PokemonSearchFilter from '../components/PokemonSearchFilter';
import { RootState } from '../../../store';
import { List } from 'react-virtualized';
import usePokemonData from '../hooks/usePokemonData';
import VirtualizedPokemonGrid from '../components/VirtualizedPokemonGrid';
import PaginationControls from '../components/PaginationControls';
import { FullPageLoading, ErrorMessage, EmptyListMessage } from '../components/LoadingErrorStates';
import { FilterOptions } from '../types';

const CARDS_PER_ROW = 5;

/**
 * PokemonListContainer is the main container component for the Pokemon list page.
 * It manages the search, filtering, and pagination of Pokemon.
 */
const PokemonListContainer: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.pokemon.favorites);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    minHeight: undefined,
    maxHeight: undefined,
    minWeight: undefined,
    maxWeight: undefined,
    abilities: [],
  });
  // Use null but handle the null case in the methods that use the ref
  const listRef = useRef<List>(null);
  
  // Use the custom hook to manage Pokemon data
  const {
    filteredPokemons,
    availableAbilities,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    totalPages,
    hasNextPage,
    loadNextPage,
    loadPreviousPage,
    allPokemons
  } = usePokemonData(searchTerm, filters);

  // Navigation handlers
  const handleSelectPokemon = useCallback((id: number) => {
    router.push(`/pokemon/${id}`);
  }, [router]);

  const handleToggleFavorite = useCallback((id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(id));
  }, [dispatch]);

  // Search and filter handlers
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    // Reset list scroll position when search changes
    if (listRef.current) {
      listRef.current.scrollToRow(0);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Reset list scroll position when filters change
    if (listRef.current) {
      listRef.current.scrollToRow(0);
    }
  }, []);

  // Handle infinite scroll
  const handleListScroll = useCallback(({ clientHeight, scrollHeight, scrollTop }: { clientHeight: number, scrollHeight: number, scrollTop: number }) => {
    // Load more when user scrolls to bottom (with a buffer of 200px)
    if (scrollHeight - scrollTop - clientHeight < 200 && hasNextPage && !isLoading && !isLoadingMore) {
      loadNextPage();
    }
  }, [hasNextPage, isLoading, isLoadingMore, loadNextPage]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <PokemonSearchFilter
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        availableAbilities={availableAbilities}
      />
      
      {/* Pagination Controls */}
      {allPokemons.length > 0 && !isLoading && !error && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          onPreviousPage={loadPreviousPage}
          onNextPage={loadNextPage}
        />
      )}
      
      {/* Loading, Error, and Empty States */}
      {isLoading && allPokemons.length === 0 ? (
        <FullPageLoading />
      ) : error ? (
        <ErrorMessage />
      ) : filteredPokemons.length === 0 ? (
        <EmptyListMessage />
      ) : (
        <>
          {/* Virtualized Pokemon Grid */}
          <VirtualizedPokemonGrid
            pokemons={filteredPokemons}
            favorites={favorites}
            cardsPerRow={CARDS_PER_ROW}
            onSelectPokemon={handleSelectPokemon}
            onToggleFavorite={handleToggleFavorite}
            onScroll={handleListScroll}
            listRef={listRef}
          />
          
          {/* Loading More Indicator */}
          {isLoadingMore && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PokemonListContainer;
