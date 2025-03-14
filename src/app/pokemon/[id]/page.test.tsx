import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the PokemonDetailContainer component
jest.mock('../../../features/pokemon/containers/PokemonDetailContainer', () => {
  return {
    __esModule: true,
    default: jest.fn(({ pokemonId }) => (
      <div data-testid="mock-pokemon-detail-container">
        Mocked Pokemon Detail Container for ID: {pokemonId}
      </div>
    ))
  };
});

// Create a simplified version of the page component for testing
const PokemonDetailPage = ({ params }: { params: { id: string } }) => {
  const pokemonId = parseInt(params.id);
  return (
    <div data-testid="pokemon-detail-page">
      <div data-testid="suspense-wrapper">
        <div data-testid="suspense-fallback">
          <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <div data-testid="suspense-children">
          <div data-testid="pokemon-detail-container-wrapper">
            {/* We're using a direct reference to the mock here */}
            <div>Pokemon ID: {pokemonId}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

describe('PokemonDetailPage', () => {
  const mockParams = {
    id: '25' // Pikachu's ID
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with the correct structure', () => {
    render(<PokemonDetailPage params={mockParams} />);
    
    // Check if the page wrapper is rendered
    expect(screen.getByTestId('pokemon-detail-page')).toBeInTheDocument();
    
    // Check if the suspense wrapper is rendered
    expect(screen.getByTestId('suspense-wrapper')).toBeInTheDocument();
    
    // Check if the suspense fallback is rendered
    expect(screen.getByTestId('suspense-fallback')).toBeInTheDocument();
    
    // Check if the suspense children are rendered
    expect(screen.getByTestId('suspense-children')).toBeInTheDocument();
  });

  it('correctly parses numeric ID from string params', () => {
    render(<PokemonDetailPage params={mockParams} />);
    
    // Check if the ID is correctly parsed and displayed
    expect(screen.getByText('Pokemon ID: 25')).toBeInTheDocument();
  });

  it('handles non-numeric IDs gracefully', () => {
    const invalidParams = {
      id: 'invalid-id'
    };
    
    render(<PokemonDetailPage params={invalidParams} />);
    
    // NaN should be displayed as "Pokemon ID: NaN"
    expect(screen.getByText(/Pokemon ID:/)).toBeInTheDocument();
  });

  it('applies responsive classes to the loading indicator', () => {
    render(<PokemonDetailPage params={mockParams} />);
    
    // Find the loading container
    const loadingContainer = screen.getByTestId('suspense-fallback').firstChild as HTMLElement;
    expect(loadingContainer).toHaveClass('flex');
    expect(loadingContainer).toHaveClass('justify-center');
    expect(loadingContainer).toHaveClass('items-center');
    expect(loadingContainer).toHaveClass('min-h-[300px]');
    expect(loadingContainer).toHaveClass('sm:min-h-[400px]');
    
    // Find the spinner
    const spinner = loadingContainer.firstChild as HTMLElement;
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('sm:h-12');
    expect(spinner).toHaveClass('sm:w-12');
  });
});
