import api from './api'
import { User, Movie, LoginInput, RegisterInput } from '../types'

export const userService = {
  register: (data: RegisterInput) => api.post<User>('/users', data),

  login: (data: LoginInput) => api.post<User>('/users/login', data),

  updateProfile: (data: { fullName?: string; email?: string; image?: string }) =>
    api.put<User>('/users', data),

  deleteProfile: () => api.delete<{ message: string }>('/users'),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put<{ message: string }>('/users/password', data),

  getFavorites: () => api.get<Movie[]>('/users/favorites'),

  addFavorite: (movieId: string) => api.post<{ message: string }>('/users/favorites', { movieId }),

  clearFavorites: () => api.delete<{ message: string }>('/users/favorites'),

  getAllUsers: () => api.get<User[]>('/users'),

  deleteUser: (userId: string) => api.delete<{ message: string }>(`/users/${userId}`),
}
