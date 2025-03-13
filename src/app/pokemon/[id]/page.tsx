import { Suspense } from 'react';
import PokemonDetailContainer from '../../../features/pokemon/containers/PokemonDetailContainer';

interface PokemonDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  // Ensure params is properly awaited
  const resolvedParams = await Promise.resolve(params);
  const pokemonId = parseInt(resolvedParams.id);

  return (
    <div>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <PokemonDetailContainer pokemonId={pokemonId} />
      </Suspense>
    </div>
  );
}
