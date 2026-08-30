import api from './api'
import { Movie, MovieCreateInput, MovieUpdateInput, MoviesListResponse, MoviesQueryParams } from '../types'

export const moviesService = {
  getMovies: (params?: MoviesQueryParams) => api.get<MoviesListResponse>('/movies', { params }),

  getMovieById: (id: string) => api.get<Movie>(`/movies/${id}`),

  getTopRatedMovies: () => api.get<Movie[]>('/movies/rated/top'),

  getRandomMovies: () => api.get<Movie[]>('/movies/random/all'),

  createMovieReview: (movieId: string, data: { rating: number; comment: string }) =>
    api.post<{ message: string }>(`/movies/${movieId}/reviews`, data),

  createMovie: (data: MovieCreateInput) => api.post<Movie>('/movies', data),

  updateMovie: (id: string, data: MovieUpdateInput) => api.put<Movie>(`/movies/${id}`, data),

  deleteMovie: (id: string) => api.delete<{ message: string }>(`/movies/${id}`),

  deleteAllMovies: () => api.delete<{ message: string }>('/movies'),
}
