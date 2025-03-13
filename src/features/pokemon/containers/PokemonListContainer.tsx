'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPokemonListQuery } from '../api/pokemonApi';
import { toggleFavorite } from '../../../store/pokemonSlice';
import PokemonSearchFilter, { FilterOptions } from '../components/PokemonSearchFilter';
import { filterPokemonByName, filterPokemonByAttributes, extractAbilities } from '../utils/filterUtils';
import { RootState } from '../../../store';
import { PokemonDetail, Pokemon } from '../types';
import { List, AutoSizer, ListRowProps } from 'react-virtualized';
import Image from 'next/image';

const ITEMS_PER_PAGE = 20;
const CARDS_PER_ROW = 5;

const PokemonListContainer: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.pokemon.favorites);
  const [currentPage, setCurrentPage] = useState(0);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    minHeight: undefined,
    maxHeight: undefined,
    minWeight: undefined,
    maxWeight: undefined,
    abilities: [],
  });
  const [pokemonDetails, setPokemonDetails] = useState<Record<number, PokemonDetail>>({});
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsToFetch, setDetailsToFetch] = useState<number[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<List>(null);
  
  // Fetch the paginated Pokemon list
  const { data, error, isLoading } = useGetPokemonListQuery({
    offset: currentPage * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });

  // Update allPokemons when new data is fetched
  useEffect(() => {
    if (data?.results) {
      setAllPokemons(prevPokemons => {
        // Filter out duplicates
        const newPokemons = data.results.filter(
          newPokemon => !prevPokemons.some(p => p.id === newPokemon.id)
        );
        return [...prevPokemons, ...newPokemons];
      });
      
      setHasNextPage(!!data.next);
      setIsLoadingMore(false);
    }
  }, [data]);

  // Apply search and filters to all fetched Pokemon
  const filteredPokemons = useMemo(() => {
    if (allPokemons.length === 0) return [];
    
    // First filter by name (client-side search)
    const nameFiltered = filterPokemonByName(allPokemons, searchTerm);
    
    // Then filter by attributes if we have details loaded
    return filterPokemonByAttributes(nameFiltered, pokemonDetails, filters);
  }, [allPokemons, searchTerm, filters, pokemonDetails]);

  // Extract available abilities from loaded Pokemon details
  const availableAbilities = useMemo(() => {
    return extractAbilities(pokemonDetails);
  }, [pokemonDetails]);

  // Identify which Pokemon details need to be fetched
  useEffect(() => {
    if (allPokemons.length === 0) return;
    
    const idsToFetch = allPokemons
      .filter(pokemon => !pokemonDetails[pokemon.id])
      .map(pokemon => pokemon.id);
    
    if (idsToFetch.length > 0) {
      setDetailsToFetch(idsToFetch);
    }
  }, [allPokemons, pokemonDetails]);

  // Fetch details for the Pokemon that need details
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (detailsToFetch.length === 0) return;
      
      setIsLoadingDetails(true);
      
      try {
        const newDetails: Record<number, PokemonDetail> = { ...pokemonDetails };
        const fetchPromises = detailsToFetch.map(async (id) => {
          try {
            // Using fetch directly to avoid RTK Query cache issues with multiple concurrent requests
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch Pokemon ${id}`);
            const details: PokemonDetail = await response.json();
            newDetails[id] = details;
          } catch (err) {
            console.error(`Error fetching details for Pokemon ${id}:`, err);
          }
        });
        
        await Promise.all(fetchPromises);
        setPokemonDetails(newDetails);
        setDetailsToFetch([]);
      } catch (err) {
        console.error('Error fetching Pokemon details:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    
    fetchPokemonDetails();
  }, [detailsToFetch, pokemonDetails]);

  const handleSelectPokemon = useCallback((id: number) => {
    router.push(`/pokemon/${id}`);
  }, [router]);

  const handleToggleFavorite = useCallback((id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(toggleFavorite(id));
  }, [dispatch]);

  const handleNextPage = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [hasNextPage, isLoadingMore]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    // Reset list scroll position when search changes
    if (listRef.current) {
      listRef.current.scrollToPosition(0);
    }
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    // Reset list scroll position when filters change
    if (listRef.current) {
      listRef.current.scrollToPosition(0);
    }
  }, []);

  // Handle infinite scroll
  const handleListScroll = useCallback(({ clientHeight, scrollHeight, scrollTop }: { clientHeight: number, scrollHeight: number, scrollTop: number }) => {
    // Load more when user scrolls to bottom (with a buffer of 200px)
    if (scrollHeight - scrollTop - clientHeight < 200 && hasNextPage && !isLoading && !isLoadingMore) {
      handleNextPage();
    }
  }, [handleNextPage, hasNextPage, isLoading, isLoadingMore]);

  // Calculate row count based on items per row
  const rowCount = Math.ceil(filteredPokemons.length / CARDS_PER_ROW);

  // Row renderer for virtualized list
  const rowRenderer = useCallback(({ index, key, style }: ListRowProps) => {
    const startIdx = index * CARDS_PER_ROW;
    const pokemonsInRow = filteredPokemons.slice(startIdx, startIdx + CARDS_PER_ROW);
    
    return (
      <div key={key} style={style} className="flex space-x-4 mb-4">
        {pokemonsInRow.map(pokemon => {
          const isFavorite = favorites.includes(pokemon.id);
          
          return (
            <div 
              key={pokemon.id} 
              className="mb-4 flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleSelectPokemon(pokemon.id)}
              data-testid={`pokemon-card-${pokemon.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
                <button 
                  onClick={(e) => handleToggleFavorite(pokemon.id, e)}
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
        })}
        
        {/* Fill empty slots with invisible placeholders to maintain grid layout */}
        {Array.from({ length: CARDS_PER_ROW - pokemonsInRow.length }).map((_, i) => (
          <div key={`empty-${i}`} className="flex-1 invisible" />
        ))}
      </div>
    );
  }, [filteredPokemons, favorites, handleSelectPokemon, handleToggleFavorite]);

  const totalPages = data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0;

  return (
    <div className="space-y-4">
      <PokemonSearchFilter
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        availableAbilities={availableAbilities}
      />
      
      {data && !isLoading && !error && (
        <div className="flex justify-between items-center mb-4 px-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded ${
              currentPage > 0
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            data-testid="previous-button"
          >
            Previous
          </button>
          
          <div className="text-center">
            <span data-testid="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={`px-4 py-2 rounded ${
              hasNextPage
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            data-testid="next-button"
          >
            Next
          </button>
        </div>
      )}
      
      
      {isLoading && allPokemons.length === 0 ? (
        <div className="flex justify-center items-center h-64" data-testid="loading-indicator">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8" data-testid="error-message">
          <p>Error: Failed to load Pokemon list</p>
        </div>
      ) : filteredPokemons.length === 0 ? (
        <div className="text-center py-8" data-testid="empty-list">
          <p>No Pokémon found.</p>
        </div>
      ) : (
        <div className="h-[65vh]" data-testid="pokemon-list">
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                height={height}
                width={width}
                rowCount={rowCount}
                rowHeight={220}
                rowRenderer={rowRenderer}
                onScroll={handleListScroll}
                overscanRowCount={5}
              />
            )}
          </AutoSizer>
          
          {/* Loading indicator at the bottom */}
          {isLoadingDetails && !isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonListContainer;
