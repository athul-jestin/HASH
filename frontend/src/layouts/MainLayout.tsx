import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { FaBars, FaTimes, FaUserCircle, FaChevronDown, FaFilm } from 'react-icons/fa'
import { useAuth } from '@contexts/AuthContext'
import clsx from 'clsx'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'text-sm font-medium transition-colors hover:text-text',
    isActive ? 'text-text' : 'text-text-muted'
  )

export const MainLayout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-accent">
              <FaFilm size={20} />
              <span className="font-display text-2xl tracking-widest text-text">HASH</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <NavLink to="/movies" className={navLinkClass}>
                Movies
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/chatbot" className={navLinkClass}>
                  Chatbot
                </NavLink>
              )}
              {user?.isAdmin && (
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
              )}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover">
                  {user?.image ? (
                    <img src={user.image} alt={user.fullName} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle size={28} className="text-text-muted" />
                  )}
                  <span>{user?.fullName}</span>
                  <FaChevronDown size={10} className="text-text-muted" />
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md border border-border bg-surface py-1 shadow-lg focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={clsx(
                            'block w-full px-4 py-2 text-left text-sm text-text',
                            active && 'bg-surface-hover'
                          )}
                        >
                          Log out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            className="text-text md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-border px-4 pb-4 pt-2 md:hidden">
            <nav className="flex flex-col gap-3">
              <NavLink to="/movies" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Movies
              </NavLink>
              {isAuthenticated && (
                <NavLink to="/chatbot" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Chatbot
                </NavLink>
              )}
              {user?.isAdmin && (
                <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Dashboard
                </NavLink>
              )}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-left text-sm font-medium text-text-muted">
                  Log out
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-text-muted" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/register" className="text-sm font-medium text-text-muted" onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-muted sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} HASH. Your personal movie hub.
        </div>
      </footer>
    </div>
  )
}
