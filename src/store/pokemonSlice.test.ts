import pokemonReducer, {
  toggleFavorite,
  addToRecentlyViewed,
  hydrate,
  PokemonState
} from './pokemonSlice';

describe('pokemonSlice', () => {
  let initialState: PokemonState;

  beforeEach(() => {
    // Reset the initial state before each test
    initialState = {
      favorites: [],
      recentlyViewed: []
    };

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
  });

  it('should handle initial state', () => {
    expect(pokemonReducer(undefined, { type: 'unknown' })).toEqual({
      favorites: [],
      recentlyViewed: []
    });
  });

  describe('toggleFavorite', () => {
    it('should add a Pokemon to favorites if not already present', () => {
      const pokemonId = 1;
      const action = toggleFavorite(pokemonId);
      const state = pokemonReducer(initialState, action);

      expect(state.favorites).toContain(pokemonId);
      expect(state.favorites.length).toBe(1);
    });

    it('should remove a Pokemon from favorites if already present', () => {
      const pokemonId = 1;
      const stateWithFavorite = {
        ...initialState,
        favorites: [pokemonId]
      };
      const action = toggleFavorite(pokemonId);
      const state = pokemonReducer(stateWithFavorite, action);

      expect(state.favorites).not.toContain(pokemonId);
      expect(state.favorites.length).toBe(0);
    });
  });

  describe('addToRecentlyViewed', () => {
    it('should add a Pokemon to recently viewed', () => {
      const pokemonId = 1;
      const action = addToRecentlyViewed(pokemonId);
      const state = pokemonReducer(initialState, action);

      expect(state.recentlyViewed).toContain(pokemonId);
      expect(state.recentlyViewed.length).toBe(1);
      expect(state.recentlyViewed[0]).toBe(pokemonId);
    });

    it('should move a Pokemon to the front of recently viewed if already present', () => {
      const pokemonId1 = 1;
      const pokemonId2 = 2;
      const stateWithRecentlyViewed = {
        ...initialState,
        recentlyViewed: [pokemonId2, pokemonId1]
      };
      const action = addToRecentlyViewed(pokemonId1);
      const state = pokemonReducer(stateWithRecentlyViewed, action);

      expect(state.recentlyViewed[0]).toBe(pokemonId1);
      expect(state.recentlyViewed[1]).toBe(pokemonId2);
      expect(state.recentlyViewed.length).toBe(2);
    });

    it('should limit recently viewed to 10 items', () => {
      // Create an array with 10 items
      const recentlyViewed = Array.from({ length: 10 }, (_, i) => i + 1);
      const stateWithRecentlyViewed = {
        ...initialState,
        recentlyViewed
      };
      const newPokemonId = 11;
      const action = addToRecentlyViewed(newPokemonId);
      const state = pokemonReducer(stateWithRecentlyViewed, action);

      expect(state.recentlyViewed.length).toBe(10);
      expect(state.recentlyViewed[0]).toBe(newPokemonId);
      expect(state.recentlyViewed).not.toContain(10); // The oldest item should be removed
    });
  });

  describe('hydrate', () => {
    it('should replace the state with the provided state', () => {
      const newState: PokemonState = {
        favorites: [1, 2, 3],
        recentlyViewed: [4, 5, 6]
      };
      const action = hydrate(newState);
      const state = pokemonReducer(initialState, action);

      expect(state).toEqual(newState);
    });
  });
});
