import api from './api'
import { UploadResponse } from '../types'

export const uploadService = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadResponse>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  uploadVideo: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<UploadResponse>('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
