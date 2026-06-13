import { Movie } from '../../types'

export type MoviesState = {
  movies: Movie[]
  topRated: Movie[]
  random: Movie[]
  isLoading: boolean
  error: string | null
  pagination: {
    page: number
    pages: number
    totalMovies: number
  }
}

export type ModalsState = {
  isMainModalOpen: boolean
  isShareModalOpen: boolean
  isCategoryModalOpen: boolean
  isCastModalOpen: boolean
  isImagePreviewOpen: boolean
  selectedData: unknown | null
}

export type NotificationsState = {
  notifications: Array<{ id: string; message: string; type: string; duration?: number }>
}
