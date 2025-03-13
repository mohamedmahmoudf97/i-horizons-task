import { Suspense } from "react";
import PokemonListContainer from "../features/pokemon/containers/PokemonListContainer";

export default function Home() {
  return (
    <div>
      <header className="mb-4 sm:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Pokédex</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Explore the world of Pokémon
        </p>
      </header>
      
      <main>
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <PokemonListContainer />
        </Suspense>
      </main>
    </div>
  );
}
