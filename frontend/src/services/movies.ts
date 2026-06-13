import api from './api'
import { Movie, PaginatedResponse, ApiResponse } from '../types'

export const moviesService = {
  getMovies: (params?: {
    category?: string
    time?: number
    language?: string
    rate?: number
    year?: number
    search?: string
    pageNumber?: number
  }) =>
    api.get<PaginatedResponse<Movie>>('/movies', { params }),

  getMovieById: (id: string) =>
    api.get<ApiResponse<Movie>>(`/movies/${id}`),

  getTopRatedMovies: () =>
    api.get<ApiResponse<Movie[]>>('/movies/rated/top'),

  getRandomMovies: () =>
    api.get<ApiResponse<Movie[]>>('/movies/random/all'),

  createMovieReview: (movieId: string, data: { rating: number; comment: string }) =>
    api.post(`/movies/${movieId}/reviews`, data),

  createMovie: (data: Omit<Movie, '_id' | 'id' | 'userId' | 'reviews' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<Movie>>('/movies', data),

  updateMovie: (id: string, data: Partial<Movie>) =>
    api.put<ApiResponse<Movie>>(`/movies/${id}`, data),

  deleteMovie: (id: string) =>
    api.delete(`/movies/${id}`),

  deleteAllMovies: () =>
    api.delete('/movies'),
}
