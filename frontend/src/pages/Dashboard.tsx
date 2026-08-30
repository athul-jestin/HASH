import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import clsx from 'clsx'
import DashboardOverview from './dashboard/Overview'
import DashboardMovies from './dashboard/Movies'
import MovieForm from './dashboard/MovieForm'
import DashboardCategories from './dashboard/Categories'
import DashboardUsers from './dashboard/Users'

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/movies', label: 'Movies' },
  { to: '/dashboard/categories', label: 'Categories' },
  { to: '/dashboard/users', label: 'Users' },
]

const Dashboard: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl">Dashboard</h1>

      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <nav className="flex gap-2 overflow-x-auto md:w-48 md:flex-col md:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                clsx(
                  'shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-accent text-white' : 'text-text-muted hover:bg-surface-hover hover:text-text'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="movies" element={<DashboardMovies />} />
            <Route path="movies/new" element={<MovieForm />} />
            <Route path="movies/:id/edit" element={<MovieForm />} />
            <Route path="categories" element={<DashboardCategories />} />
            <Route path="users" element={<DashboardUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
