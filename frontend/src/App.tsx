import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@components/ProtectedRoute'

// Lazy-load pages for code splitting
const Home = React.lazy(() => import('@pages/Home'))
const Login = React.lazy(() => import('@pages/Login'))
const Register = React.lazy(() => import('@pages/Register'))
const Movies = React.lazy(() => import('@pages/Movies'))
const SingleMovie = React.lazy(() => import('@pages/SingleMovie'))
const Dashboard = React.lazy(() => import('@pages/Dashboard'))
const Chatbot = React.lazy(() => import('@pages/Chatbot'))
const NotFound = React.lazy(() => import('@pages/NotFound'))

const App: React.FC = () => {
  return (
    <Router>
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<SingleMovie />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Router>
  )
}

export default App
