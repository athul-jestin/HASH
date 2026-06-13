import { createModel } from '@rematch/core'
import { Movie } from '../../types'
import type { MoviesState } from './types'

const initialState: MoviesState = {
  movies: [],
  topRated: [],
  random: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    totalMovies: 0,
  },
}

export const moviesModel = createModel<MoviesState>()({
  state: initialState,
  reducers: {
    setMovies(state: MoviesState, payload: { movies: Movie[]; page: number; pages: number; totalMovies: number }) {
      return {
        ...state,
        movies: payload.movies,
        pagination: {
          page: payload.page,
          pages: payload.pages,
          totalMovies: payload.totalMovies,
        },
      }
    },
    setTopRated(state: MoviesState, payload: Movie[]) {
      return {
        ...state,
        topRated: payload,
      }
    },
    setRandom(state: MoviesState, payload: Movie[]) {
      return {
        ...state,
        random: payload,
      }
    },
    setLoading(state: MoviesState, payload: boolean) {
      return {
        ...state,
        isLoading: payload,
      }
    },
    setError(state: MoviesState, payload: string | null) {
      return {
        ...state,
        error: payload,
      }
    },
    addMovie(state: MoviesState, payload: Movie) {
      return {
        ...state,
        movies: [...state.movies, payload],
      }
    },
    updateMovie(state: MoviesState, payload: Movie) {
      return {
        ...state,
        movies: state.movies.map((m) => (m._id === payload._id ? payload : m)),
      }
    },
    deleteMovie(state: MoviesState, payload: string) {
      return {
        ...state,
        movies: state.movies.filter((m) => m._id !== payload),
      }
    },
    clearMovies() {
      return initialState
    },
  },
})
