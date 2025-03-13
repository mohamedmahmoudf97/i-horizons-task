import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useGetPokemonListQuery } from '../api/pokemonApi';
import PokemonListContainer from './PokemonListContainer';
import pokemonReducer from '../../../store/pokemonSlice';
import * as filterUtils from '../utils/filterUtils';

// Mock react-virtualized
jest.mock('react-virtualized', () => {
  const List = ({ rowRenderer }: { rowRenderer: (params: { index: number; key: string; style: React.CSSProperties }) => React.ReactNode }) => {
    // Render a few rows to test the component
    return (
      <div data-testid="virtualized-list">
        {rowRenderer({ index: 0, key: 'row-0', style: {} })}
      </div>
    );
  };
  
  const AutoSizer = ({ children }: { children: (size: { width: number; height: number }) => React.ReactNode }) => children({ width: 1000, height: 600 });
  
  return {
    List,
    AutoSizer,
  };
});

// Mock the RTK Query hook
jest.mock('../api/pokemonApi', () => ({
  useGetPokemonListQuery: jest.fn(),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: jest.fn(),
    middleware: jest.fn(() => jest.fn()),
    endpoints: {
      getPokemonList: {
        initiate: jest.fn(),
      },
    },
  },
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the filter utils
jest.mock('../utils/filterUtils', () => ({
  filterPokemonByName: jest.fn(pokemons => pokemons),
  filterPokemonByAttributes: jest.fn(pokemons => pokemons),
  extractAbilities: jest.fn(() => ['overgrow', 'chlorophyll']),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; width?: number; height?: number; className?: string }) => {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

// Mock fetch for Pokemon details
global.fetch = jest.fn().mockImplementation((url) => {
  const id = url.split('/').pop();
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      id: Number(id),
      name: `pokemon-${id}`,
      height: 7,
      weight: 69,
      abilities: [
        { ability: { name: 'overgrow', url: '' }, is_hidden: false, slot: 1 },
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
    }),
  });
});

describe('PokemonListContainer', () => {
  const mockPokemons = [
    {
      id: 1,
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/'
    },
    {
      id: 2,
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/'
    },
    {
      id: 3,
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/'
    },
    {
      id: 4,
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/4/'
    },
    {
      id: 5,
      name: 'charmeleon',
      url: 'https://pokeapi.co/api/v2/pokemon/5/'
    }
  ];

  const mockStore = configureStore({
    reducer: {
      pokemon: pokemonReducer,
      pokemonApi: (state = {}) => state,
    },
    preloadedState: {
      pokemon: {
        favorites: [1],
        recentlyViewed: [],
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: {
        count: 1118,
        results: mockPokemons,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
        previous: null,
      },
      error: undefined,
      isLoading: false,
    });
  });

  it('renders the component with Pokemon data', async () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
    });

    // Check if at least one Pokemon card is rendered
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('renders search and filter components', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    // Check if search input is rendered
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-filters-button')).toBeInTheDocument();
  });

  it('displays pagination controls', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    // Check if pagination controls are rendered
    expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-info')).toBeInTheDocument();
  });

  it('handles search term changes', async () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    // Find the search input and change its value
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'bulba' } });

    // Check if the filter function was called
    await waitFor(() => {
      expect(filterUtils.filterPokemonByName).toHaveBeenCalledWith(expect.anything(), 'bulba');
    });
  });

  it('shows loading state when isLoading is true', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: undefined,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { status: 500, data: 'Server error' },
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('shows empty state when no Pokemon are found', () => {
    (filterUtils.filterPokemonByAttributes as jest.Mock).mockReturnValue([]);

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('empty-list')).toBeInTheDocument();
  });
});
