import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useGetPokemonListQuery } from '../api/pokemonApi';
import PokemonListContainer from './PokemonListContainer';
import pokemonReducer from '../../../store/pokemonSlice';
import * as filterUtils from '../utils/filterUtils';

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
    
    (filterUtils.filterPokemonByName as jest.Mock).mockImplementation((pokemons) => pokemons);
    (filterUtils.filterPokemonByAttributes as jest.Mock).mockImplementation((pokemons) => pokemons);
  });

  it('renders the PokemonList component with the correct props', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    // Check if the Pokemon names are displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    
    // Check if the favorite status is correctly passed
    const favoriteButton1 = screen.getByTestId('favorite-button-1');
    const favoriteButton2 = screen.getByTestId('favorite-button-2');
    
    expect(favoriteButton1).toHaveTextContent('❤️'); // Should be favorite
    expect(favoriteButton2).toHaveTextContent('🤍'); // Should not be favorite
  });

  it('displays loading state when data is loading', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: undefined,
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

  it('displays error state when there is an error', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: { message: 'Failed to fetch' },
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to load Pokemon list')).toBeInTheDocument();
  });

  it('displays empty state when there are no Pokemon', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: { 
        count: 0,
        results: [],
        next: null,
        previous: null,
      },
      error: undefined,
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('empty-list')).toBeInTheDocument();
    expect(screen.getByText('No Pokémon found.')).toBeInTheDocument();
  });

  it('renders pagination controls when data is loaded', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('pagination-info')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    expect(screen.getByTestId('previous-button')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 56')).toBeInTheDocument(); // 1118 / 20 = 55.9, rounded up to 56
  });

  it('disables previous button on first page', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    const previousButton = screen.getByTestId('previous-button');
    expect(previousButton).toBeDisabled();
    expect(previousButton).toHaveClass('bg-gray-300');
  });

  it('enables next button when there are more pages', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    const nextButton = screen.getByTestId('next-button');
    expect(nextButton).not.toBeDisabled();
    expect(nextButton).toHaveClass('bg-blue-500');
  });

  it('enables previous button and disables next button on last page', () => {
    (useGetPokemonListQuery as jest.Mock).mockReturnValue({
      data: {
        count: 1118,
        results: mockPokemons,
        next: null,
        previous: 'https://pokeapi.co/api/v2/pokemon?offset=1080&limit=20',
      },
      error: undefined,
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    const previousButton = screen.getByTestId('previous-button');
    const nextButton = screen.getByTestId('next-button');
    
    expect(previousButton).not.toBeDisabled();
    expect(previousButton).toHaveClass('bg-blue-500');
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveClass('bg-gray-300');
  });

  it('renders search and filter components', () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    expect(screen.getByTestId('search-filter-container')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-filters-button')).toBeInTheDocument();
  });

  it('filters Pokemon by name when search input changes', async () => {
    (filterUtils.filterPokemonByName as jest.Mock).mockImplementation(() => [mockPokemons[0]]);
    
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'bulba' } });

    await waitFor(() => {
      expect(filterUtils.filterPokemonByName).toHaveBeenCalledWith(mockPokemons, 'bulba');
    });
  });

  it('applies filters when filter options change', async () => {
    (filterUtils.filterPokemonByAttributes as jest.Mock).mockImplementation(() => [mockPokemons[0]]);
    
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    // Show the filter panel
    const toggleButton = screen.getByTestId('toggle-filters-button');
    fireEvent.click(toggleButton);

    // Apply filters
    const applyButton = screen.getByTestId('apply-filters-button');
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(filterUtils.filterPokemonByAttributes).toHaveBeenCalled();
    });
  });

  it('fetches Pokemon details for filtering', async () => {
    render(
      <Provider store={mockStore}>
        <PokemonListContainer />
      </Provider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1');
      expect(global.fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/2');
    });
  });
});
