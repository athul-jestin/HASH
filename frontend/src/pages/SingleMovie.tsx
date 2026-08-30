import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa'
import { moviesService, userService } from '@services/index'
import { useAuth } from '@contexts/AuthContext'
import { RatingStars } from '@components/RatingStars'
import { Loader } from '@components/Loader'

const SingleMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, user } = useAuth()
  const queryClient = useQueryClient()
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')

  const {
    data: movieResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesService.getMovieById(id!),
    enabled: Boolean(id),
  })

  const { data: favoritesResponse } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => userService.getFavorites(),
    enabled: isAuthenticated,
  })

  const addFavoriteMutation = useMutation({
    mutationFn: () => userService.addFavorite(id!),
    onSuccess: () => {
      toast.success('Added to favorites')
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const reviewMutation = useMutation({
    mutationFn: () => moviesService.createMovieReview(id!, { rating: reviewRating, comment: reviewComment }),
    onSuccess: () => {
      toast.success('Review submitted')
      setReviewComment('')
      queryClient.invalidateQueries({ queryKey: ['movie', id] })
    },
    onError: (err: AxiosError<{ detail?: string }>) => {
      toast.error(err.response?.data?.detail || 'Could not submit review')
    },
  })

  if (isLoading) return <Loader fullPage />

  if (isError || !movieResponse) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl">Movie not found</h1>
        <Link to="/movies" className="btn-primary mt-6 inline-flex">
          Back to Movies
        </Link>
      </div>
    )
  }

  const movie = movieResponse.data
  const isFavorited = (favoritesResponse?.data ?? []).some((favorite) => favorite.id === movie.id)
  const hasReviewed = isAuthenticated && movie.reviews.some((review) => review.userId === user?.id)

  return (
    <div>
      <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden sm:h-[55vh]">
        <img src={movie.image} alt={movie.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      </div>

      <div className="mx-auto -mt-24 max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row">
          <img
            src={movie.titleImage}
            alt={movie.name}
            className="aspect-[2/3] w-40 shrink-0 rounded-md object-cover shadow-2xl sm:w-56"
          />

          <div className="flex-1 pt-2">
            <h1 className="text-4xl sm:text-5xl">{movie.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <RatingStars rating={movie.rate} showValue />
              <span>({movie.numberOfReviews} reviews)</span>
              <span>·</span>
              <span>{movie.year}</span>
              <span>·</span>
              <span>{movie.time} min</span>
              <span>·</span>
              <span>{movie.language}</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">{movie.category}</span>
            </div>

            <p className="mt-5 max-w-2xl leading-relaxed text-text">{movie.desc}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {isAuthenticated ? (
                <button
                  className="btn-secondary"
                  disabled={isFavorited || addFavoriteMutation.isPending}
                  onClick={() => addFavoriteMutation.mutate()}
                >
                  {isFavorited ? <FaHeart className="text-accent" /> : <FaRegHeart />}
                  {isFavorited ? 'In Favorites' : 'Add to Favorites'}
                </button>
              ) : (
                <Link to="/login" className="btn-secondary">
                  <FaRegHeart /> Log in to save
                </Link>
              )}
            </div>
          </div>
        </div>

        {movie.video && (
          <div className="mt-12">
            <h2 className="text-2xl">Watch</h2>
            <video controls className="mt-4 w-full rounded-md bg-black" src={movie.video}>
              <FaPlay />
            </video>
          </div>
        )}

        {movie.casts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl">Cast</h2>
            <div className="row-scroll mt-4 flex gap-4 overflow-x-auto pb-2">
              {movie.casts.map((cast) => (
                <div key={cast.id} className="w-20 shrink-0 text-center">
                  <img src={cast.image} alt={cast.name} className="h-20 w-20 rounded-full object-cover" />
                  <p className="mt-2 line-clamp-2 text-xs text-text-muted">{cast.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl">Reviews</h2>

          {isAuthenticated && !hasReviewed && (
            <form
              className="card mt-4 space-y-3 p-5"
              onSubmit={(e) => {
                e.preventDefault()
                reviewMutation.mutate()
              }}
            >
              <div>
                <label className="field-label">Your rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="input-field w-32"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} star{value > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Comment</label>
                <textarea
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="input-field min-h-24"
                  placeholder="What did you think?"
                />
              </div>
              <button type="submit" disabled={reviewMutation.isPending} className="btn-primary">
                {reviewMutation.isPending ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          )}

          {isAuthenticated && hasReviewed && (
            <p className="mt-4 text-sm text-text-muted">You&apos;ve already reviewed this movie. Thanks!</p>
          )}

          {!isAuthenticated && (
            <p className="mt-4 text-sm text-text-muted">
              <Link to="/login" className="text-accent hover:text-accent-hover">
                Log in
              </Link>{' '}
              to leave a review.
            </p>
          )}

          <div className="mt-6 space-y-4">
            {movie.reviews.length === 0 && <p className="text-sm text-text-muted">No reviews yet.</p>}
            {movie.reviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-3">
                  {review.userImage ? (
                    <img src={review.userImage} alt={review.userName} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover text-xs">
                      {review.userName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{review.userName}</p>
                    <RatingStars rating={review.rating} size={11} />
                  </div>
                </div>
                <p className="mt-3 text-sm text-text-muted">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMovie
