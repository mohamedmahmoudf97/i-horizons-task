import { Suspense } from "react";
import PokemonListContainer from "../features/pokemon/containers/PokemonListContainer";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Pokédex</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore the world of Pokémon
        </p>
      </header>
      
      <main>
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <PokemonListContainer />
        </Suspense>
      </main>
    </div>
  );
}
