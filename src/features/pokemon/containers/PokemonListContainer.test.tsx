import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PokemonListContainer from './PokemonListContainer';
import pokemonReducer from '../../../store/pokemonSlice';
import * as usePokemonDataModule from '../hooks/usePokemonData';

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
  default: function MockImage(props: { src: string | undefined; alt: string | undefined; }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} data-testid="next-image" />;
  },
}));

// Mock usePokemonData hook
jest.mock('../hooks/usePokemonData', () => ({
  __esModule: true,
  default: jest.fn(),
}));

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

  // Default mock implementation for usePokemonData
  const mockUsePokemonData = {
    filteredPokemons: mockPokemons,
    availableAbilities: ['overgrow', 'chlorophyll'],
    isLoading: false,
    isLoadingMore: false,
    error: undefined,
    currentPage: 0,
    totalPages: 10,
    hasNextPage: true,
    loadNextPage: jest.fn(),
    loadPreviousPage: jest.fn(),
    allPokemons: mockPokemons
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementation for usePokemonData
    (usePokemonDataModule.default as jest.Mock).mockReturnValue(mockUsePokemonData);
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    // We don't need to test the filter function here since it's mocked
    // Just verify the input works
    expect(searchInput).toHaveValue('bulba');
  });

  it('shows loading state when isLoading is true', () => {
    // Override the default mock for this specific test
    (usePokemonDataModule.default as jest.Mock).mockReturnValue({
      ...mockUsePokemonData,
      isLoading: true,
      allPokemons: []
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    // Override the default mock for this specific test
    (usePokemonDataModule.default as jest.Mock).mockReturnValue({
      ...mockUsePokemonData,
      error: { status: 500, data: 'Server error' },
      isLoading: false
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('shows empty state when no Pokemon are found', () => {
    // Override the default mock for this specific test
    (usePokemonDataModule.default as jest.Mock).mockReturnValue({
      ...mockUsePokemonData,
      filteredPokemons: []
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('empty-list')).toBeInTheDocument();
  });
});
