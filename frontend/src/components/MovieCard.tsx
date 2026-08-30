import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPlay } from 'react-icons/fa'
import { Movie } from '../types'

export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative block aspect-[2/3] w-full shrink-0 overflow-hidden rounded-md bg-surface"
    >
      {!imageFailed ? (
        <img
          src={movie.titleImage}
          alt={movie.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-bg">
          <span className="font-display text-3xl text-text-muted">{movie.name.charAt(0)}</span>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
          <FaPlay size={12} />
        </div>
        <p className="line-clamp-2 text-sm font-semibold text-white">{movie.name}</p>
        <p className="mt-0.5 text-xs text-text-muted">
          {movie.year} · {movie.category}
        </p>
      </div>
    </Link>
  )
}
