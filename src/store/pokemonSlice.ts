import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState } from './middleware/localStorage';

export interface PokemonState {
  favorites: number[];
  recentlyViewed: number[];
}

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
    },
    addToRecentlyViewed: (state, action: PayloadAction<number>) => {
      const pokemonId = action.payload;
      // Remove if already exists to avoid duplicates
      state.recentlyViewed = state.recentlyViewed.filter(id => id !== pokemonId);
      
      // Add to the beginning of the array
      state.recentlyViewed.unshift(pokemonId);
      
      // Keep only the 10 most recent
      state.recentlyViewed = state.recentlyViewed.slice(0, 10);
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
