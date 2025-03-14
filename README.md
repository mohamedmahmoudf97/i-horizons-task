This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Pokemon Explorer

A Next.js application built as part of a technical assessment that allows users to explore Pokemon using the PokeAPI.

## Live Demo
[View Demo](https://i-horizons-task.vercel.app/)

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Set Environment Variable**
Create `.env.local`:
```bash
NEXT_PUBLIC_POKEMON_API_URL=https://pokeapi.co/api/v2
```

3. **Run Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Features

- 🔍 Browse Pokemon with pagination
- 💾 Favorite Pokemon functionality with local storage
- 🌓 Dark/Light theme support
- 📱 Responsive design
- 🧪 Test coverage

## Tech Stack

- Next.js 14
- TypeScript
- Redux Toolkit & RTK Query
- Tailwind CSS
- Jest & React Testing Library

## Testing

```bash
npm test
```# Pokemon Explorer

## Project StructureA Next.js application built as part of a technical assessment that allows users to explore Pokemon using the PokeAPI.
```
src/## Live Demo
├── app/          # Next.js app components
├── features/     # Feature modules
├── store/        # Redux configuration
└── test/         # Test setup
```**Install Dependencies**
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
