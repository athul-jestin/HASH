import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User, AuthState } from '../types'

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken || null,
      isLoading: false,
    }
  })

  const login = (user: User, token: string) => {
    setAuthState((prev) => ({ ...prev, user, token }))
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setAuthState((prev) => ({ ...prev, user: null, token: null }))
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isAuthenticated: !!authState.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
