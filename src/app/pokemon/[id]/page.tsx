import { Suspense } from 'react';
import PokemonDetailContainer from '../../../features/pokemon/containers/PokemonDetailContainer';

interface PokemonDetailPageProps {
  params: {
    id: string;
  };
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const pokemonId = parseInt(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <PokemonDetailContainer pokemonId={pokemonId} />
      </Suspense>
    </div>
  );
}
