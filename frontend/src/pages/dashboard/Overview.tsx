import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { moviesService, categoriesService, userService } from '@services/index'

const StatCard: React.FC<{ label: string; value: React.ReactNode; to: string }> = ({ label, value, to }) => (
  <Link to={to} className="card block p-6 transition-colors hover:bg-surface-hover">
    <p className="text-sm text-text-muted">{label}</p>
    <p className="font-display mt-2 text-4xl">{value}</p>
  </Link>
)

const DashboardOverview: React.FC = () => {
  const { data: moviesData, isLoading: loadingMovies } = useQuery({
    queryKey: ['movies', { pageNumber: 1 }],
    queryFn: () => moviesService.getMovies({ pageNumber: 1 }),
  })
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  })
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  })

  return (
    <div>
      <p className="text-text-muted">Manage your movies, categories, and users.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Movies" value={loadingMovies ? '…' : moviesData?.data.totalMovies ?? 0} to="/dashboard/movies" />
        <StatCard
          label="Categories"
          value={loadingCategories ? '…' : categoriesData?.data.length ?? 0}
          to="/dashboard/categories"
        />
        <StatCard label="Users" value={loadingUsers ? '…' : usersData?.data.length ?? 0} to="/dashboard/users" />
      </div>
    </div>
  )
}

export default DashboardOverview
