import api from './api'
import { Category, ApiResponse } from '../types'

export const categoriesService = {
  getCategories: () =>
    api.get<ApiResponse<Category[]>>('/categories'),

  createCategory: (data: { title: string }) =>
    api.post<ApiResponse<Category>>('/categories', data),

  updateCategory: (id: string, data: { title: string }) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data),

  deleteCategory: (id: string) =>
    api.delete(`/categories/${id}`),
}
