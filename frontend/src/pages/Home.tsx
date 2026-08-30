import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FaPlay } from 'react-icons/fa'
import { moviesService } from '@services/index'
import { MovieCard } from '@components/MovieCard'
import { Movie } from '../types'

const MovieRow: React.FC<{ title: string; movies: Movie[]; loading: boolean }> = ({ title, movies, loading }) => (
  <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <h2 className="text-2xl">{title}</h2>
    <div className="row-scroll mt-4 flex gap-4 overflow-x-auto pb-2">
      {loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] w-36 shrink-0 animate-pulse rounded-md bg-surface sm:w-44" />
        ))}
      {!loading &&
        movies.map((movie) => (
          <div key={movie.id} className="w-36 shrink-0 sm:w-44">
            <MovieCard movie={movie} />
          </div>
        ))}
    </div>
  </section>
)

const Home: React.FC = () => {
  const { data: topRated, isLoading: loadingTopRated } = useQuery({
    queryKey: ['movies', 'top-rated'],
    queryFn: () => moviesService.getTopRatedMovies(),
  })
  const { data: random, isLoading: loadingRandom } = useQuery({
    queryKey: ['movies', 'random'],
    queryFn: () => moviesService.getRandomMovies(),
  })

  const heroMovie = random?.data?.[0] ?? topRated?.data?.[0]

  return (
    <div>
      <div className="relative flex h-[70vh] min-h-[420px] w-full items-end overflow-hidden">
        {heroMovie ? (
          <img src={heroMovie.image} alt={heroMovie.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-bg" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/10" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {heroMovie ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">Featured</p>
              <h1 className="mt-2 max-w-2xl text-5xl sm:text-6xl">{heroMovie.name}</h1>
              <p className="mt-4 max-w-xl text-text-muted line-clamp-3">{heroMovie.desc}</p>
              <div className="mt-6 flex gap-3">
                <Link to={`/movies/${heroMovie.id}`} className="btn-primary">
                  <FaPlay size={12} /> View Details
                </Link>
                <Link to="/movies" className="btn-secondary">
                  Browse All
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl sm:text-6xl">Welcome to HASH</h1>
              <p className="mt-4 max-w-xl text-text-muted">Your personal movie hub.</p>
              <Link to="/movies" className="btn-primary mt-6 inline-flex">
                Explore Movies
              </Link>
            </>
          )}
        </div>
      </div>

      <MovieRow title="Top Rated" movies={topRated?.data ?? []} loading={loadingTopRated} />
      <MovieRow title="Discover Something New" movies={random?.data ?? []} loading={loadingRandom} />
    </div>
  )
}

export default Home
