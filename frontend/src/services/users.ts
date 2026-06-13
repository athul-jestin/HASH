import api from './api'
import { User, ApiResponse } from '../types'

export const userService = {
  register: (data: { fullName: string; email: string; password: string; image?: string }) =>
    api.post<ApiResponse<User>>('/users', data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<User>>('/users/login', data),

  updateProfile: (data: { fullName?: string; email?: string; image?: string }) =>
    api.put<ApiResponse<User>>('/users', data),

  deleteProfile: () =>
    api.delete('/users'),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.put('/users/password', data),

  getFavorites: () =>
    api.get('/users/favorites'),

  addFavorite: (movieId: string) =>
    api.post('/users/favorites', { movieId }),

  removeFavorites: () =>
    api.delete('/users/favorites'),

  getAllUsers: () =>
    api.get<ApiResponse<User[]>>('/users'),

  deleteUser: (userId: string) =>
    api.delete(`/users/${userId}`),
}
