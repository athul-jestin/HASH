// User types
export interface User {
  id: string
  fullName: string
  email: string
  image?: string | null
  isAdmin: boolean
  token?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  token: string | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  fullName: string
  email: string
  password: string
}

// Movie types
export interface MovieCast {
  id: string
  name: string
  image: string
}

export interface MovieCastInput {
  name: string
  image: string
}

export interface MovieReview {
  id: string
  userId: string
  userName: string
  userImage?: string | null
  rating: number
  comment: string
  createdAt: string
}

export interface Movie {
  id: string
  userId?: string | null
  name: string
  desc: string
  titleImage: string
  image: string
  category: string
  language: string
  year: number
  time: number
  video?: string | null
  rate: number
  numberOfReviews: number
  reviews: MovieReview[]
  casts: MovieCast[]
  createdAt: string
  updatedAt: string
}

export interface MovieCreateInput {
  name: string
  desc: string
  titleImage: string
  image: string
  categoryId: string
  language: string
  year: number
  time: number
  video?: string | null
  casts: MovieCastInput[]
}

export type MovieUpdateInput = Partial<MovieCreateInput>

export interface MoviesListResponse {
  movies: Movie[]
  page: number
  pages: number
  totalMovies: number
}

export interface MoviesQueryParams {
  category?: string
  time?: number
  language?: string
  rate?: number
  year?: number
  search?: string
  pageNumber?: number
}

// Category types
export interface Category {
  id: string
  title: string
}

// Upload
export interface UploadResponse {
  path: string
  url: string
}

// Chatbot types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatbotResponse {
  replies: string
}
