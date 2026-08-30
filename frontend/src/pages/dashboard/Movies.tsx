import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa'
import { moviesService } from '@services/index'
import { RatingStars } from '@components/RatingStars'
import { ConfirmDialog } from '@components/ConfirmDialog'
import { Loader } from '@components/Loader'

const DashboardMovies: React.FC = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-movies', page],
    queryFn: () => moviesService.getMovies({ pageNumber: page }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => moviesService.deleteMovie(id),
    onSuccess: () => {
      toast.success('Movie deleted')
      setPendingDeleteId(null)
      queryClient.invalidateQueries({ queryKey: ['dashboard-movies'] })
    },
    onError: (err: AxiosError<{ detail?: string }>) => {
      toast.error(err.response?.data?.detail || 'Could not delete movie')
    },
  })

  const movies = data?.data.movies ?? []
  const pages = data?.data.pages ?? 1

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Movies</h2>
        <Link to="/dashboard/movies/new" className="btn-primary">
          <FaPlus size={12} /> New Movie
        </Link>
      </div>

      {isLoading && <Loader />}

      {!isLoading && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Year</th>
                <th className="py-2 pr-4 font-medium">Rating</th>
                <th className="py-2 pr-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={movie.titleImage} alt={movie.name} className="h-12 w-9 rounded object-cover" />
                      <span className="font-medium">{movie.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-text-muted">{movie.category}</td>
                  <td className="py-3 pr-4 text-text-muted">{movie.year}</td>
                  <td className="py-3 pr-4">
                    <RatingStars rating={movie.rate} size={12} />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex justify-end gap-3 text-text-muted">
                      <Link to={`/dashboard/movies/${movie.id}/edit`} className="hover:text-text" aria-label="Edit">
                        <FaPen size={14} />
                      </Link>
                      <button
                        onClick={() => setPendingDeleteId(movie.id)}
                        className="hover:text-accent"
                        aria-label="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {movies.length === 0 && <p className="mt-6 text-text-muted">No movies yet.</p>}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {page} of {pages}
          </span>
          <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete movie?"
        description="This permanently removes the movie and its reviews. This cannot be undone."
        isLoading={deleteMutation.isPending}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId && deleteMutation.mutate(pendingDeleteId)}
      />
    </div>
  )
}

export default DashboardMovies
