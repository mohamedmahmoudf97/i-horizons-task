import { Suspense } from 'react';
import { Metadata } from 'next';
import PokemonDetailContainer from '../../../features/pokemon/containers/PokemonDetailContainer';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Pokemon #${id}`,
    description: `Details for Pokemon #${id}`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  const pokemonId = parseInt(id);

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
