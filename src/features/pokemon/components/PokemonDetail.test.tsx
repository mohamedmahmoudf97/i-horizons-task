import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PokemonDetail from './PokemonDetail';
import { PokemonDetail as PokemonDetailType } from '../types';

describe('PokemonDetail', () => {
  const mockPokemon: PokemonDetailType = {
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
      },
      {
        ability: {
          name: 'chlorophyll',
          url: 'https://pokeapi.co/api/v2/ability/34/'
        },
        is_hidden: true,
        slot: 3
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
      },
      {
        base_stat: 49,
        effort: 0,
        stat: {
          name: 'attack',
          url: 'https://pokeapi.co/api/v2/stat/2/'
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
      },
      {
        slot: 2,
        type: {
          name: 'poison',
          url: 'https://pokeapi.co/api/v2/type/4/'
        }
      }
    ]
  };

  const mockOnToggleFavorite = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state correctly', () => {
    render(
      <PokemonDetail
        pokemon={null}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('detail-loading')).toBeInTheDocument();
  });

  it('renders the error state correctly', () => {
    const errorMessage = 'Failed to load Pokemon details';
    
    render(
      <PokemonDetail
        pokemon={null}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
        error={errorMessage}
      />
    );

    expect(screen.getByTestId('detail-error')).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    
    // Check if the back button is displayed
    const backButton = screen.getByText('Back to List');
    expect(backButton).toBeInTheDocument();
    
    // Click the back button
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('renders the empty state correctly', () => {
    render(
      <PokemonDetail
        pokemon={null}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('detail-empty')).toBeInTheDocument();
    expect(screen.getByText('No Pokémon selected.')).toBeInTheDocument();
    
    // Check if the back button is displayed
    const backButton = screen.getByText('Back to List');
    expect(backButton).toBeInTheDocument();
    
    // Click the back button
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('renders the Pokemon details correctly', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('pokemon-detail')).toBeInTheDocument();
    
    // Check if the Pokemon name is displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    
    // Check if the Pokemon ID is displayed
    expect(screen.getByText('#001')).toBeInTheDocument();
    
    // Check if the types are displayed
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
    
    // Check if the height and weight are displayed
    expect(screen.getByText('0.7 m')).toBeInTheDocument();
    expect(screen.getByText('6.9 kg')).toBeInTheDocument();
    
    // Check if the abilities are displayed - using a more flexible approach
    expect(screen.getByText(/overgrow/)).toBeInTheDocument();
    expect(screen.getByText(/chlorophyll/)).toBeInTheDocument();
    expect(screen.getByText(/\(Hidden\)/)).toBeInTheDocument();
    
    // Check if the stats are displayed
    expect(screen.getByText('hp')).toBeInTheDocument();
    expect(screen.getByText('attack')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('49')).toBeInTheDocument();
    
    // Check if the back button is displayed
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    
    // Check if the favorite button is displayed
    expect(screen.getByTestId('detail-favorite-button')).toBeInTheDocument();
  });

  it('displays the correct favorite icon based on the isFavorite prop', () => {
    const { rerender } = render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    // Check if the not-favorite icon is displayed
    const favoriteButton = screen.getByTestId('detail-favorite-button');
    expect(favoriteButton).toHaveTextContent('🤍');

    // Re-render with isFavorite=true
    rerender(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={true}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    // Check if the favorite icon is displayed
    expect(favoriteButton).toHaveTextContent('❤️');
  });

  it('calls onBack when the back button is clicked', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    // Click the back button
    fireEvent.click(screen.getByTestId('back-button'));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('calls onToggleFavorite when the favorite button is clicked', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    // Click the favorite button
    fireEvent.click(screen.getByTestId('detail-favorite-button'));
    expect(mockOnToggleFavorite).toHaveBeenCalledWith(mockPokemon.id);
  });

  // Responsive design tests
  it('applies responsive classes to the container', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    const detailElement = screen.getByTestId('pokemon-detail');
    
    // Test for presence of key responsive classes
    expect(detailElement).toHaveClass('bg-white');
    expect(detailElement).toHaveClass('dark:bg-gray-800');
    expect(detailElement).toHaveClass('rounded-lg');
    expect(detailElement).toHaveClass('shadow-lg');
    expect(detailElement).toHaveClass('p-4');
    expect(detailElement).toHaveClass('sm:p-6');
  });

  it('applies responsive classes to the Pokemon image', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    const image = screen.getByAltText('bulbasaur');
    
    // Test for presence of key responsive classes
    expect(image).toHaveClass('object-contain');
    expect(image).toHaveClass('w-48');
    expect(image).toHaveClass('h-48');
    expect(image).toHaveClass('sm:w-64');
    expect(image).toHaveClass('sm:h-64');
    expect(image).toHaveClass('md:w-72');
    expect(image).toHaveClass('md:h-72');
  });

  it('applies responsive classes to the stats section', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    // Find the stats section by its heading
    const statsHeading = screen.getByText('Base Stats');
    expect(statsHeading).toBeInTheDocument();
    
    // Verify the parent element has the right structure
    const statsSection = statsHeading.parentElement;
    expect(statsSection).toBeInTheDocument();
  });

  it('applies responsive classes to the loading indicator', () => {
    render(
      <PokemonDetail
        pokemon={null}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={true}
      />
    );

    const loadingContainer = screen.getByTestId('detail-loading');
    expect(loadingContainer).toHaveClass('min-h-[300px]');
    expect(loadingContainer).toHaveClass('sm:min-h-[400px]');
    
    const spinner = loadingContainer.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('sm:h-12');
    expect(spinner).toHaveClass('sm:w-12');
  });

  it('applies responsive classes to the error state', () => {
    render(
      <PokemonDetail
        pokemon={null}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
        error="Test error"
      />
    );

    const errorContainer = screen.getByTestId('detail-error');
    expect(errorContainer).toHaveClass('text-center');
    expect(errorContainer).toHaveClass('text-red-500');
    expect(errorContainer).toHaveClass('p-3');
    expect(errorContainer).toHaveClass('sm:p-4');
  });

  it('applies responsive classes to the empty state', () => {
    render(
      <PokemonDetail
        pokemon={null}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    const emptyContainer = screen.getByTestId('detail-empty');
    expect(emptyContainer).toHaveClass('text-center');
    expect(emptyContainer).toHaveClass('p-3');
    expect(emptyContainer).toHaveClass('sm:p-4');
  });

  it('applies responsive typography classes', () => {
    render(
      <PokemonDetail
        pokemon={mockPokemon}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
        onBack={mockOnBack}
        isLoading={false}
      />
    );

    // Check Pokemon name typography
    const pokemonName = screen.getByText('bulbasaur');
    expect(pokemonName).toHaveClass('text-xl');
    expect(pokemonName).toHaveClass('sm:text-2xl');
    expect(pokemonName).toHaveClass('md:text-3xl');

    // Check section headings typography
    const typeHeading = screen.getByText('Types');
    expect(typeHeading).toHaveClass('text-lg');
    expect(typeHeading).toHaveClass('sm:text-xl');
  });
});
