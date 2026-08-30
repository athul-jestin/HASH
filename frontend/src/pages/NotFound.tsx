import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => (
  <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
    <div className="text-center">
      <h1 className="font-display text-8xl text-accent">404</h1>
      <p className="mt-2 text-xl text-text-muted">Page not found</p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        Go Home
      </Link>
    </div>
  </div>
)

export default NotFound
