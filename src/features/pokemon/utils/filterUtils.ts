import { FilterOptions, Pokemon, PokemonDetail } from '../types';

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
 * Check if any filters are active
 * @param filters Filter options
 * @returns Boolean indicating if any filters are active
 */
export const hasActiveFilters = (filters: FilterOptions): boolean => {
  return !!(
    filters.abilities.length > 0 ||
    filters.minHeight !== undefined ||
    filters.maxHeight !== undefined ||
    filters.minWeight !== undefined ||
    filters.maxWeight !== undefined
  );
};

/**
 * Filter Pokemon by height
 * @param pokemon Pokemon detail to check
 * @param minHeight Minimum height filter
 * @param maxHeight Maximum height filter
 * @returns Boolean indicating if Pokemon passes height filters
 */
const meetsHeightCriteria = (
  pokemon: PokemonDetail,
  minHeight?: number,
  maxHeight?: number
): boolean => {
  if (minHeight !== undefined && pokemon.height < minHeight) {
    return false;
  }
  
  if (maxHeight !== undefined && pokemon.height > maxHeight) {
    return false;
  }
  
  return true;
};

/**
 * Filter Pokemon by weight
 * @param pokemon Pokemon detail to check
 * @param minWeight Minimum weight filter
 * @param maxWeight Maximum weight filter
 * @returns Boolean indicating if Pokemon passes weight filters
 */
const meetsWeightCriteria = (
  pokemon: PokemonDetail,
  minWeight?: number,
  maxWeight?: number
): boolean => {
  if (minWeight !== undefined && pokemon.weight < minWeight) {
    return false;
  }
  
  if (maxWeight !== undefined && pokemon.weight > maxWeight) {
    return false;
  }
  
  return true;
};

/**
 * Check if Pokemon has any of the specified abilities
 * @param pokemon Pokemon detail to check
 * @param abilities Array of ability names to filter by
 * @returns Boolean indicating if Pokemon has any of the specified abilities
 */
const hasMatchingAbility = (
  pokemon: PokemonDetail,
  abilities: string[]
): boolean => {
  if (abilities.length === 0) return true;
  
  const pokemonAbilities = pokemon.abilities.map(a => a.ability.name);
  return abilities.some(ability => pokemonAbilities.includes(ability));
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
  if (!filters || !hasActiveFilters(filters)) {
    return pokemons;
  }

  return pokemons.filter(pokemon => {
    const details = pokemonDetails[pokemon.id];
    
    // Skip Pokemon without details
    if (!details) return false;
    
    // Apply all filter criteria
    return (
      meetsHeightCriteria(details, filters.minHeight, filters.maxHeight) &&
      meetsWeightCriteria(details, filters.minWeight, filters.maxWeight) &&
      hasMatchingAbility(details, filters.abilities)
    );
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
