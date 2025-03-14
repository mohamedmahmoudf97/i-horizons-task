import { filterPokemonByName, filterPokemonByAttributes, extractAbilities, hasActiveFilters } from './filterUtils';
import { FilterOptions, Pokemon, PokemonDetail } from '../types';

describe('filterUtils', () => {
  // Mock data for testing
  const mockPokemons: Pokemon[] = [
    { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { id: 3, name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    { id: 4, name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  ];

  const mockPokemonDetails: Record<number, PokemonDetail> = {
    1: {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      abilities: [
        { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
        { ability: { name: 'chlorophyll', url: '' }, is_hidden: true, slot: 3 },
      ],
      sprites: {
        front_default: '',
        back_default: '',
        front_shiny: '',
        back_shiny: '',
        other: { 'official-artwork': { front_default: '' } },
      },
      stats: [],
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    },
    2: {
      id: 2,
      name: 'ivysaur',
      height: 10,
      weight: 130,
      abilities: [
        { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
        { ability: { name: 'chlorophyll', url: '' }, is_hidden: true, slot: 3 },
      ],
      sprites: {
        front_default: '',
        back_default: '',
        front_shiny: '',
        back_shiny: '',
        other: { 'official-artwork': { front_default: '' } },
      },
      stats: [],
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    },
    4: {
      id: 4,
      name: 'charmander',
      height: 6,
      weight: 85,
      abilities: [
        { ability: { name: 'blaze', url: '' }, is_hidden: false, slot: 1 },
        { ability: { name: 'solar-power', url: '' }, is_hidden: true, slot: 3 },
      ],
      sprites: {
        front_default: '',
        back_default: '',
        front_shiny: '',
        back_shiny: '',
        other: { 'official-artwork': { front_default: '' } },
      },
      stats: [],
      types: [{ slot: 1, type: { name: 'fire', url: '' } }],
    },
  };

  describe('hasActiveFilters', () => {
    it('returns false when no filters are active', () => {
      const emptyFilters: FilterOptions = {
        abilities: [],
        minHeight: undefined,
        maxHeight: undefined,
        minWeight: undefined,
        maxWeight: undefined
      };
      expect(hasActiveFilters(emptyFilters)).toBe(false);
    });

    it('returns true when abilities filter is active', () => {
      const filters: FilterOptions = {
        abilities: ['overgrow'],
        minHeight: undefined,
        maxHeight: undefined,
        minWeight: undefined,
        maxWeight: undefined
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('returns true when height filter is active', () => {
      const filters: FilterOptions = {
        abilities: [],
        minHeight: 10,
        maxHeight: undefined,
        minWeight: undefined,
        maxWeight: undefined
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it('returns true when weight filter is active', () => {
      const filters: FilterOptions = {
        abilities: [],
        minHeight: undefined,
        maxHeight: undefined,
        minWeight: undefined,
        maxWeight: 100
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });
  });

  describe('filterPokemonByName', () => {
    it('returns all Pokemon when search term is empty', () => {
      const result = filterPokemonByName(mockPokemons, '');
      expect(result).toEqual(mockPokemons);
    });

    it('filters Pokemon by name correctly', () => {
      const result = filterPokemonByName(mockPokemons, 'saur');
      expect(result).toHaveLength(3);
      expect(result.map(p => p.id)).toEqual([1, 2, 3]);
    });

    it('is case insensitive', () => {
      const result = filterPokemonByName(mockPokemons, 'CHAR');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('returns empty array when no matches found', () => {
      const result = filterPokemonByName(mockPokemons, 'pikachu');
      expect(result).toHaveLength(0);
    });

    it('trims whitespace from search term', () => {
      const result = filterPokemonByName(mockPokemons, '  char  ');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });
  });

  describe('filterPokemonByAttributes', () => {
    it('returns all Pokemon when no filters are applied', () => {
      const emptyFilters: FilterOptions = {
        abilities: [],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, emptyFilters);
      expect(result).toEqual(mockPokemons);
    });

    it('filters Pokemon by minimum height', () => {
      const filters: FilterOptions = {
        minHeight: 7,
        abilities: [],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toEqual([1, 2]);
    });

    it('filters Pokemon by maximum height', () => {
      const filters: FilterOptions = {
        maxHeight: 7,
        abilities: [],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toEqual([1, 4]);
    });

    it('filters Pokemon by minimum weight', () => {
      const filters: FilterOptions = {
        minWeight: 80,
        abilities: [],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(2);
      expect(result.map(p => p.id)).toEqual([2, 4]);
    });

    it('filters Pokemon by maximum weight', () => {
      const filters: FilterOptions = {
        maxWeight: 80,
        abilities: [],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('filters Pokemon by ability', () => {
      const filters: FilterOptions = {
        abilities: ['blaze'],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(4);
    });

    it('filters Pokemon by multiple abilities (OR logic)', () => {
      const filters: FilterOptions = {
        abilities: ['blaze', 'chlorophyll'],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(3);
      expect(result.map(p => p.id)).toEqual([1, 2, 4]);
    });

    it('combines multiple filter criteria', () => {
      const filters: FilterOptions = {
        minHeight: 7,
        maxWeight: 100,
        abilities: ['overgrow'],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('skips Pokemon without details', () => {
      const filters: FilterOptions = {
        minHeight: 5,
        abilities: [],
      };
      const result = filterPokemonByAttributes(mockPokemons, mockPokemonDetails, filters);
      expect(result).toHaveLength(3);
      expect(result.map(p => p.id)).toEqual([1, 2, 4]);
    });
  });

  describe('extractAbilities', () => {
    it('extracts unique abilities from Pokemon details', () => {
      const abilities = extractAbilities(mockPokemonDetails);
      expect(abilities).toHaveLength(4);
      expect(abilities).toContain('overgrow');
      expect(abilities).toContain('chlorophyll');
      expect(abilities).toContain('blaze');
      expect(abilities).toContain('solar-power');
    });

    it('returns abilities in alphabetical order', () => {
      const abilities = extractAbilities(mockPokemonDetails);
      expect(abilities).toEqual(['blaze', 'chlorophyll', 'overgrow', 'solar-power']);
    });

    it('returns empty array when no Pokemon details are provided', () => {
      const abilities = extractAbilities({});
      expect(abilities).toHaveLength(0);
    });
  });
});
