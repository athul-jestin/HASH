import api from './api'
import { Category } from '../types'

export const categoriesService = {
  getCategories: () => api.get<Category[]>('/categories'),

  createCategory: (data: { title: string }) => api.post<Category>('/categories', data),

  updateCategory: (id: string, data: { title: string }) => api.put<Category>(`/categories/${id}`, data),

  deleteCategory: (id: string) => api.delete<{ message: string }>(`/categories/${id}`),
}
