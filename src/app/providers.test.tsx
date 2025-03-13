import React from 'react';
import { render } from '@testing-library/react';
import { Providers } from './providers';

// Mock the store
jest.mock('../store', () => ({
  store: {
    getState: jest.fn(),
    subscribe: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe('Providers', () => {
  it('renders children without crashing', () => {
    const { getByText } = render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    );
    
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
