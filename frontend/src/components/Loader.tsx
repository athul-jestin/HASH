import React from 'react'

interface LoaderProps {
  size?: 'small' | 'medium' | 'large'
  fullPage?: boolean
}

export const Loader: React.FC<LoaderProps> = ({ size = 'medium', fullPage = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  }

  const loader = (
    <div className={`animate-spin rounded-full border-4 border-surface-hover border-t-accent ${sizeClasses[size]}`} />
  )

  if (fullPage) {
    return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">{loader}</div>
  }

  return <div className="flex items-center justify-center">{loader}</div>
}
