// User types
export interface User {
  id: string
  fullName: string
  email: string
  image?: string
  isAdmin: boolean
  token?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  token: string | null
}

// Movie types
export interface MovieCast {
  name: string
  image: string
}

export interface MovieReview {
  _id?: string
  id?: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  userId: string
  createdAt?: string
}

export interface Movie {
  _id?: string
  id?: string
  userId: string
  name: string
  desc: string
  titleImage: string
  image: string
  category: string
  language: string
  year: number
  time: number
  video?: string
  rate: number
  numberOfReviews: number
  reviews: MovieReview[]
  casts: MovieCast[]
  createdAt?: string
  updatedAt?: string
}

// Category types
export interface Category {
  _id?: string
  id?: string
  title: string
  createdAt?: string
  updatedAt?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  movies?: T[]
  page: number
  pages: number
  totalMovies: number
}

// Chatbot types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatbotResponse {
  replies: string
}
