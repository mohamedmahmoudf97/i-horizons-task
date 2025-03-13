This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Pokemon Application

This application allows users to browse a list of Pokemon, view detailed information about each Pokemon, and mark their favorites. The application is built using Next.js, TypeScript, Redux Toolkit, and RTK Query.

## Features

- **Pokemon List**: View a paginated list of Pokemon with their images and basic information
- **Pagination**: Navigate through the complete Pokemon list with next and previous buttons
- **Pokemon Details**: Click on a Pokemon to view detailed information including stats, abilities, and types
- **Favorites**: Mark Pokemon as favorites for quick access
- **Recently Viewed**: Keep track of recently viewed Pokemon
- **Persistent Storage**: Favorites and recently viewed Pokemon are stored in localStorage

## Tech Stack

- **Next.js**: Framework for server-side rendering and routing
- **TypeScript**: For type safety and better developer experience
- **Redux Toolkit**: For state management
- **RTK Query**: For data fetching and caching
- **Jest & React Testing Library**: For unit testing

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

The application uses the following environment variables:

- `NEXT_PUBLIC_POKEMON_API_URL`: The base URL for the Pokemon API (defaults to 'https://pokeapi.co/api/v2')

Create a `.env.local` file in the root directory to set these variables:

```
NEXT_PUBLIC_POKEMON_API_URL=https://pokeapi.co/api/v2
```

## Configuration

The application uses a `next.config.js` file to configure Next.js. This includes setting up image domains for the Pokemon API:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};

module.exports = nextConfig;
```

This configuration is necessary to allow Next.js to load and optimize images from the Pokemon API.

## Testing

To run the tests:

```bash
npm test
# or
yarn test
# or
pnpm test
```

To run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
# or
pnpm test -- --coverage
```

The application has a minimum test coverage threshold of 60%.

## Project Structure

- `src/app`: Next.js app router pages and layouts
- `src/features/pokemon`: Pokemon-related components, containers, and API
  - `api`: RTK Query API services
  - `components`: Presentational components
  - `containers`: Container components that connect to Redux
  - `types`: TypeScript interfaces and types
- `src/store`: Redux store configuration and slices

## API Implementation

The application uses the [PokeAPI](https://pokeapi.co/) to fetch Pokemon data. The API implementation includes:

- **Pokemon List**: Fetches a paginated list of Pokemon with support for offset and limit parameters
- **Pokemon Details**: Fetches detailed information about a specific Pokemon by ID
- **Data Transformation**: Transforms the API response to include additional information like Pokemon IDs

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
