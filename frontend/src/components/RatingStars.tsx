import React from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'

interface RatingStarsProps {
  rating: number
  size?: number
  showValue?: boolean
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 14, showValue = false }) => {
  const rounded = Math.round(rating)

  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5 text-gold">
        {Array.from({ length: 5 }).map((_, index) =>
          index < rounded ? <FaStar key={index} size={size} /> : <FaRegStar key={index} size={size} />
        )}
      </span>
      {showValue && <span className="text-sm text-text-muted">{rating.toFixed(1)}</span>}
    </span>
  )
}
