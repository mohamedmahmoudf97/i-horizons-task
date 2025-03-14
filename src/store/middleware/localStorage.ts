import { Middleware } from '@reduxjs/toolkit';
import { PokemonState } from '../pokemonSlice';
import { RootState } from '..';

// Actions that should trigger state persistence
const PERSISTED_ACTIONS = ['pokemon/toggleFavorite', 'pokemon/addToRecentlyViewed'];

// Load state from localStorage (client-side only)
export const loadState = (): PokemonState => {
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
export const saveState = (state: PokemonState) => {
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

// Middleware to handle localStorage persistence
export const localStorageMiddleware: Middleware = 
  store => next => action => {
    // First pass the action through the reducers
    const result = next(action);
    
    // Then, if it's an action we want to persist, save the state
    if (typeof action === 'object' && action !== null && 'type' in action && 
        typeof action.type === 'string' && PERSISTED_ACTIONS.includes(action.type) && 
        typeof window !== 'undefined') {
      const state = store.getState() as RootState;
      saveState(state.pokemon);
    }
    
    return result;
  };
