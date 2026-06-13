import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ROLES } from '@utils/constants'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: (typeof ROLES)[keyof typeof ROLES][]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && user) {
    // For now, we check if user.isAdmin matches the required roles
    // You can expand this with more granular role checking
    if (requiredRoles.includes(ROLES.OWNER) && !user.isAdmin) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
