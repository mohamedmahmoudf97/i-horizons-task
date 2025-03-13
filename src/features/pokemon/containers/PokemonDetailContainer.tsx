'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPokemonByIdQuery } from '../api/pokemonApi';
import { toggleFavorite, addToRecentlyViewed } from '../../../store/pokemonSlice';
import PokemonDetail from '../components/PokemonDetail';
import { RootState } from '../../../store';

interface PokemonDetailContainerProps {
  pokemonId: number;
}

const PokemonDetailContainer: React.FC<PokemonDetailContainerProps> = ({ pokemonId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.pokemon.favorites);
  
  const { data: pokemon, error, isLoading } = useGetPokemonByIdQuery(pokemonId);

  useEffect(() => {
    if (pokemon) {
      dispatch(addToRecentlyViewed(pokemon.id));
    }
  }, [pokemon, dispatch]);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = (id: number) => {
    dispatch(toggleFavorite(id));
  };

  const isFavorite = pokemon ? favorites.includes(pokemon.id) : false;

  return (
    <PokemonDetail
      pokemon={pokemon || null}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      onBack={handleBack}
      isLoading={isLoading}
      error={error ? 'Failed to load Pokemon details' : undefined}
    />
  );
};

export default PokemonDetailContainer;
