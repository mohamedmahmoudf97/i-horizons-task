import { Pokemon, PokemonDetail } from '../types';
import { FilterOptions } from '../components/PokemonSearchFilter';

/**
 * Filter Pokemon by name based on search term
 * @param pokemons List of Pokemon to filter
 * @param searchTerm Search term to filter by
 * @returns Filtered list of Pokemon
 */
export const filterPokemonByName = (
  pokemons: Pokemon[],
  searchTerm: string
): Pokemon[] => {
  if (!searchTerm) return pokemons;
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(normalizedSearchTerm)
  );
};

/**
 * Filter Pokemon by height, weight, and abilities
 * @param pokemons List of Pokemon to filter
 * @param pokemonDetails Map of Pokemon details by ID
 * @param filters Filter options
 * @returns Filtered list of Pokemon
 */
export const filterPokemonByAttributes = (
  pokemons: Pokemon[],
  pokemonDetails: Record<number, PokemonDetail>,
  filters: FilterOptions
): Pokemon[] => {
  // If no filters are applied or no details are available, return all Pokemon
  if (
    !filters ||
    (
      filters.abilities.length === 0 &&
      filters.minHeight === undefined &&
      filters.maxHeight === undefined &&
      filters.minWeight === undefined &&
      filters.maxWeight === undefined
    )
  ) {
    return pokemons;
  }

  return pokemons.filter(pokemon => {
    const details = pokemonDetails[pokemon.id];
    
    // Skip Pokemon without details
    if (!details) return false;
    
    // Filter by height
    if (filters.minHeight !== undefined && details.height < filters.minHeight) {
      return false;
    }
    
    if (filters.maxHeight !== undefined && details.height > filters.maxHeight) {
      return false;
    }
    
    // Filter by weight
    if (filters.minWeight !== undefined && details.weight < filters.minWeight) {
      return false;
    }
    
    if (filters.maxWeight !== undefined && details.weight > filters.maxWeight) {
      return false;
    }
    
    // Filter by abilities
    if (filters.abilities.length > 0) {
      const pokemonAbilities = details.abilities.map(a => a.ability.name);
      const hasMatchingAbility = filters.abilities.some(ability => 
        pokemonAbilities.includes(ability)
      );
      
      if (!hasMatchingAbility) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Extract all unique ability names from Pokemon details
 * @param pokemonDetails Map of Pokemon details by ID
 * @returns Array of unique ability names
 */
export const extractAbilities = (
  pokemonDetails: Record<number, PokemonDetail>
): string[] => {
  const abilitiesSet = new Set<string>();
  
  Object.values(pokemonDetails).forEach(pokemon => {
    pokemon.abilities.forEach(ability => {
      abilitiesSet.add(ability.ability.name);
    });
  });
  
  return Array.from(abilitiesSet).sort();
};
