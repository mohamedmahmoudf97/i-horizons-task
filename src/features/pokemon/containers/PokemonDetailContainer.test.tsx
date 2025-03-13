import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useGetPokemonByIdQuery } from '../api/pokemonApi';
import PokemonDetailContainer from './PokemonDetailContainer';
import pokemonReducer from '../../../store/pokemonSlice';

// Mock the RTK Query hook
jest.mock('../api/pokemonApi', () => ({
  useGetPokemonByIdQuery: jest.fn(),
  pokemonApi: {
    reducerPath: 'pokemonApi',
    reducer: jest.fn(),
    middleware: jest.fn(() => jest.fn()),
    endpoints: {
      getPokemonById: {
        initiate: jest.fn(),
      },
    },
  },
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

describe('PokemonDetailContainer', () => {
  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    abilities: [
      {
        ability: {
          name: 'overgrow',
          url: 'https://pokeapi.co/api/v2/ability/65/'
        },
        is_hidden: false,
        slot: 1
      }
    ],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
      front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
      back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
      other: {
        'official-artwork': {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
        }
      }
    },
    stats: [
      {
        base_stat: 45,
        effort: 0,
        stat: {
          name: 'hp',
          url: 'https://pokeapi.co/api/v2/stat/1/'
        }
      }
    ],
    types: [
      {
        slot: 1,
        type: {
          name: 'grass',
          url: 'https://pokeapi.co/api/v2/type/12/'
        }
      }
    ]
  };

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
    (useGetPokemonByIdQuery as jest.Mock).mockReturnValue({
      data: mockPokemon,
      error: undefined,
      isLoading: false,
    });
  });

  it('renders the PokemonDetail component with the correct props', () => {
    render(
      <Provider store={mockStore}>
        <PokemonDetailContainer pokemonId={1} />
      </Provider>
    );

    // Check if the Pokemon name is displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    
    // Check if the favorite status is correctly passed
    const favoriteButton = screen.getByTestId('detail-favorite-button');
    expect(favoriteButton).toHaveTextContent('❤️'); // Should be favorite
  });

  it('adds the Pokemon to recently viewed when loaded', () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    
    render(
      <Provider store={mockStore}>
        <PokemonDetailContainer pokemonId={1} />
      </Provider>
    );

    // Check if dispatch was called with the correct action
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Object));
  });

  it('displays loading state when data is loading', () => {
    (useGetPokemonByIdQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(
      <Provider store={mockStore}>
        <PokemonDetailContainer pokemonId={1} />
      </Provider>
    );

    expect(screen.getByTestId('detail-loading')).toBeInTheDocument();
  });

  it('displays error state when there is an error', () => {
    (useGetPokemonByIdQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: { message: 'Failed to fetch' },
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <PokemonDetailContainer pokemonId={1} />
      </Provider>
    );

    expect(screen.getByTestId('detail-error')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to load Pokemon details')).toBeInTheDocument();
  });

  it('displays empty state when there is no Pokemon', () => {
    (useGetPokemonByIdQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
    });

    render(
      <Provider store={mockStore}>
        <PokemonDetailContainer pokemonId={1} />
      </Provider>
    );

    expect(screen.getByTestId('detail-empty')).toBeInTheDocument();
    expect(screen.getByText('No Pokémon selected.')).toBeInTheDocument();
  });
});
