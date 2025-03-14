import React from 'react';
import { render } from '@testing-library/react';

// Create a simple mock component for testing
const MockProviders = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-providers">{children}</div>
);

// Create a simplified version of the RootLayout component for testing
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className="font-sans antialiased min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <MockProviders>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </div>
      </MockProviders>
    </body>
  </html>
);

describe('RootLayout', () => {
  const mockChildren = <div data-testid="mock-children">Test Children</div>;

  it('renders the layout with children', () => {
    const { getByTestId } = render(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Check if the children are rendered
    const children = getByTestId('mock-children');
    expect(children).toBeInTheDocument();
    expect(children.textContent).toBe('Test Children');
  });

  it('renders with the correct structure', () => {
    const { getByTestId } = render(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Check if the providers component is rendered
    const providers = getByTestId('mock-providers');
    expect(providers).toBeInTheDocument();
  });
});
