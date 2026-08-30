import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FaSearch } from 'react-icons/fa'
import { moviesService, categoriesService } from '@services/index'
import { MovieCard } from '@components/MovieCard'

const useDebouncedValue = (value: string, delayMs: number) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timeout)
  }, [value, delayMs])
  return debounced
}

const Movies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const debouncedSearch = useDebouncedValue(searchInput, 400)

  const category = searchParams.get('category') || ''
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (debouncedSearch) next.set('search', debouncedSearch)
      else next.delete('search')
      next.delete('page')
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', { search: debouncedSearch, category, page }],
    queryFn: () =>
      moviesService.getMovies({
        search: debouncedSearch || undefined,
        category: category || undefined,
        pageNumber: page,
      }),
  })

  const movies = data?.data.movies ?? []
  const pages = data?.data.pages ?? 1
  const categories = categoriesData?.data ?? []

  const goToPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(nextPage))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl">Browse Movies</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search movies…"
            className="input-field pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev)
              if (e.target.value) next.set('category', e.target.value)
              else next.delete('category')
              next.delete('page')
              return next
            })
          }
          className="input-field sm:w-56"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-surface" />
          ))}
        </div>
      )}

      {isError && <p className="mt-10 text-text-muted">Something went wrong loading movies. Try again shortly.</p>}

      {!isLoading && !isError && movies.length === 0 && (
        <p className="mt-10 text-text-muted">No movies found. Try a different search or category.</p>
      )}

      {!isLoading && movies.length > 0 && (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button className="btn-secondary" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                Previous
              </button>
              <span className="text-sm text-text-muted">
                Page {page} of {pages}
              </span>
              <button className="btn-secondary" disabled={page >= pages} onClick={() => goToPage(page + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Movies
