import { useState, useEffect, useMemo } from 'react';
import { useGetPokemonListQuery } from '../api/pokemonApi';
import { filterPokemonByName, filterPokemonByAttributes, extractAbilities } from '../utils/filterUtils';
import { FilterOptions, Pokemon, PokemonDetail } from '../types';

const ITEMS_PER_PAGE = 20;

/**
 * Custom hook to manage Pokemon data fetching, filtering, and pagination
 */
export const usePokemonData = (searchTerm: string, filters: FilterOptions) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<Record<number, PokemonDetail>>({});
  const [detailsToFetch, setDetailsToFetch] = useState<number[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
      
      try {
        const fetchPromises = detailsToFetch.map(async (id) => {
          try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error(`Failed to fetch Pokemon ${id}`);
            const details: PokemonDetail = await response.json();
            setPokemonDetails(prevDetails => ({ ...prevDetails, [id]: details }));
          } catch (err) {
            console.error(`Error fetching details for Pokemon ${id}:`, err);
          }
        });
        
        await Promise.all(fetchPromises);
        setDetailsToFetch([]);
      } catch (err) {
        console.error('Error fetching Pokemon details:', err);
      }
    };
    
    fetchPokemonDetails();
  }, [detailsToFetch]);

  const loadNextPage = () => {
    if (hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const loadPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const totalPages = data ? Math.ceil(data.count / ITEMS_PER_PAGE) : 0;

  return {
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
  };
};

export default usePokemonData;
