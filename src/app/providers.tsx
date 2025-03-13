'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { hydrateStateFromLocalStorage } from '../store/pokemonSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  // Hydrate the state from localStorage on client-side
  useEffect(() => {
    store.dispatch(hydrateStateFromLocalStorage());
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
