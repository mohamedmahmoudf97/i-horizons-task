import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PokemonDetail, PokemonListResponse } from '../types';

// Get the base URL from environment variables or use the default
const BASE_URL = process.env.NEXT_PUBLIC_POKEMON_API_URL;
const LIMIT = 20; // Number of Pokemon per page

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Pokemon'],
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, PaginationParams>({
      query: ({ offset = 0, limit = LIMIT }) => `/pokemon?offset=${offset}&limit=${limit}`,
      transformResponse: (response: PokemonListResponse) => {
        // Add id to each Pokemon based on the URL
        return {
          ...response,
          results: response.results.map(pokemon => {
            const urlParts = pokemon.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 2]);
            return {
              ...pokemon,
              id
            };
          })
        };
      },
      providesTags: ['Pokemon']
    }),
    getPokemonById: builder.query<PokemonDetail, number>({
      query: (id) => `/pokemon/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pokemon', id }]
    }),
  }),
});

export const { useGetPokemonListQuery, useGetPokemonByIdQuery } = pokemonApi;
