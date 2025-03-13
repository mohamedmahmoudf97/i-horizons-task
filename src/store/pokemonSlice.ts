import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PokemonState {
  favorites: number[];
  recentlyViewed: number[];
}

// Load state from localStorage (client-side only)
const loadState = (): PokemonState => {
  if (typeof window === 'undefined') {
    return { favorites: [], recentlyViewed: [] };
  }
  
  try {
    const serializedState = localStorage.getItem('pokemonState');
    if (serializedState === null) {
      return { favorites: [], recentlyViewed: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return { favorites: [], recentlyViewed: [] };
  }
};

// Save state to localStorage (client-side only)
const saveState = (state: PokemonState) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('pokemonState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// Use empty initial state for server-side rendering
// We'll hydrate it on the client side
const initialState: PokemonState = { favorites: [], recentlyViewed: [] };

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      const index = state.favorites.indexOf(pokemonId);
      
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(pokemonId);
      }
      
      if (typeof window !== 'undefined') {
        saveState(state);
      }
    },
    addToRecentlyViewed: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      // Remove if already exists to avoid duplicates
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== pokemonId);
      
      // Add to the beginning of the array
      state.recentlyViewed.unshift(pokemonId);
      
      // Keep only the 10 most recent
      state.recentlyViewed = state.recentlyViewed.slice(0, 10);
      
      if (typeof window !== 'undefined') {
        saveState(state);
      }
    },
    hydrate: (state, action: PayloadAction<PokemonState>) => {
      return action.payload;
    }
  },
});

export const { toggleFavorite, addToRecentlyViewed, hydrate } = pokemonSlice.actions;

// Function to hydrate the state from localStorage
export const hydrateStateFromLocalStorage = () => {
  const state = loadState();
  return hydrate(state);
};

export default pokemonSlice.reducer;
