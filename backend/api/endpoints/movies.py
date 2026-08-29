from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, func, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.core.config import settings
from backend.core.database import get_db
from backend.dependencies import get_current_admin, get_current_user
from backend.models.category import Category
from backend.models.movie import Movie
from backend.models.movie_cast import MovieCast
from backend.models.review import Review
from backend.models.user import User
from backend.schemas.movie import (
    MovieCastResponse,
    MovieCreate,
    MovieResponse,
    MovieReviewCreate,
    MovieReviewResponse,
    MovieUpdate,
)
from backend.supabase_storage import create_signed_url, get_public_url

router = APIRouter(tags=["movies"])


def _movie_query():
    return select(Movie).options(
        selectinload(Movie.category),
        selectinload(Movie.casts),
        selectinload(Movie.reviews),
    )


def _apply_movie_filters(query, *, category, time, language, rate, year, search):
    if category:
        query = query.join(Category, Movie.category_id == Category.id).where(Category.title.ilike(category))
    if time is not None:
        query = query.where(Movie.time == time)
    if language:
        query = query.where(Movie.language == language)
    if rate is not None:
        query = query.where(Movie.rate == rate)
    if year is not None:
        query = query.where(Movie.year == year)
    if search:
        query = query.where(Movie.name.ilike(f"%{search}%"))
    return query


async def build_movie_response(movie: Movie, include_video: bool = True) -> MovieResponse:
    video_url = None
    if include_video and movie.video:
        video_url = await create_signed_url(settings.SUPABASE_BUCKET_VIDEOS, movie.video)

    return MovieResponse(
        id=str(movie.id),
        user_id=str(movie.user_id) if movie.user_id else None,
        name=movie.name,
        desc=movie.desc,
        title_image=get_public_url(settings.SUPABASE_BUCKET_IMAGES, movie.title_image),
        image=get_public_url(settings.SUPABASE_BUCKET_IMAGES, movie.image),
        category=movie.category.title,
        language=movie.language,
        year=movie.year,
        time=movie.time,
        video=video_url,
        rate=movie.rate,
        number_of_reviews=movie.number_of_reviews,
        reviews=[
            MovieReviewResponse(
                id=str(review.id),
                user_id=str(review.user_id),
                user_name=review.user_name,
                user_image=get_public_url(settings.SUPABASE_BUCKET_IMAGES, review.user_image)
                if review.user_image
                else None,
                rating=review.rating,
                comment=review.comment,
                created_at=review.created_at,
            )
            for review in movie.reviews
        ],
        casts=[
            MovieCastResponse(
                id=str(cast.id), name=cast.name, image=get_public_url(settings.SUPABASE_BUCKET_IMAGES, cast.image)
            )
            for cast in movie.casts
        ],
        created_at=movie.created_at,
        updated_at=movie.updated_at,
    )


@router.get("/movies")
async def get_movies(
    category: str | None = None,
    time: int | None = None,
    language: str | None = None,
    rate: int | None = None,
    year: int | None = None,
    search: str | None = None,
    pageNumber: int = Query(1, alias="pageNumber"),
    db: AsyncSession = Depends(get_db),
):
    limit = 10
    skip = (pageNumber - 1) * limit

    list_query = _apply_movie_filters(
        _movie_query(), category=category, time=time, language=language, rate=rate, year=year, search=search
    )
    list_query = list_query.order_by(Movie.created_at.desc()).offset(skip).limit(limit)
    movies = (await db.execute(list_query)).scalars().all()

    count_query = _apply_movie_filters(
        select(func.count(Movie.id)).select_from(Movie),
        category=category,
        time=time,
        language=language,
        rate=rate,
        year=year,
        search=search,
    )
    count = (await db.execute(count_query)).scalar_one()

    return {
        "movies": [await build_movie_response(movie, include_video=False) for movie in movies],
        "page": pageNumber,
        "pages": (count + limit - 1) // limit,
        "totalMovies": count,
    }


@router.get("/movies/{movie_id}", response_model=MovieResponse)
async def get_movie(movie_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(_movie_query().where(Movie.id == movie_id))
    movie = result.scalar_one_or_none()
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return await build_movie_response(movie, include_video=True)


@router.get("/movies/rated/top")
async def get_top_rated_movies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(_movie_query().order_by(Movie.rate.desc()).limit(100))
    movies = result.scalars().all()
    return [await build_movie_response(movie, include_video=False) for movie in movies]


@router.get("/movies/random/all")
async def get_random_movies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(_movie_query().order_by(func.random()).limit(8))
    movies = result.scalars().all()
    return [await build_movie_response(movie, include_video=False) for movie in movies]


@router.post("/movies/{movie_id}/reviews", status_code=status.HTTP_201_CREATED)
async def create_movie_review(
    movie_id: UUID,
    review: MovieReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    movie = await db.get(Movie, movie_id)
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    existing = await db.execute(select(Review).where(Review.movie_id == movie_id, Review.user_id == current_user.id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already rate this movie")

    db.add(
        Review(
            movie_id=movie_id,
            user_id=current_user.id,
            user_name=current_user.full_name,
            user_image=current_user.image,
            rating=review.rating,
            comment=review.comment,
        )
    )
    await db.flush()

    avg_subquery = select(func.avg(Review.rating)).where(Review.movie_id == movie_id).scalar_subquery()
    count_subquery = select(func.count(Review.id)).where(Review.movie_id == movie_id).scalar_subquery()
    await db.execute(update(Movie).where(Movie.id == movie_id).values(rate=avg_subquery, number_of_reviews=count_subquery))
    await db.commit()

    return {"message": "Review added"}


@router.delete("/movies", dependencies=[Depends(get_current_admin)])
async def delete_all_movies(db: AsyncSession = Depends(get_db)):
    await db.execute(delete(Movie))
    await db.commit()
    return {"message": "All movies removed"}


@router.put("/movies/{movie_id}", response_model=MovieResponse, dependencies=[Depends(get_current_admin)])
async def update_movie(movie_id: UUID, payload: MovieUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(_movie_query().where(Movie.id == movie_id))
    movie = result.scalar_one_or_none()
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    update_data = payload.model_dump(exclude_unset=True, exclude={"casts"})
    if not update_data and payload.casts is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No values to update")

    for field, value in update_data.items():
        setattr(movie, field, value)

    if payload.casts is not None:
        for cast in list(movie.casts):
            await db.delete(cast)
        movie.casts = [MovieCast(name=c.name, image=c.image, order_index=i) for i, c in enumerate(payload.casts)]

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")

    await db.refresh(movie, attribute_names=["category", "casts", "reviews"])
    return await build_movie_response(movie, include_video=False)


@router.delete("/movies/{movie_id}", dependencies=[Depends(get_current_admin)])
async def delete_movie(movie_id: UUID, db: AsyncSession = Depends(get_db)):
    movie = await db.get(Movie, movie_id)
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    await db.delete(movie)
    await db.commit()
    return {"message": "Movie removed"}


@router.post(
    "/movies", response_model=MovieResponse, dependencies=[Depends(get_current_admin)], status_code=status.HTTP_201_CREATED
)
async def create_movie(
    movie: MovieCreate,
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    new_movie = Movie(
        user_id=current_user.id,
        category_id=movie.category_id,
        name=movie.name,
        desc=movie.desc,
        title_image=movie.title_image,
        image=movie.image,
        language=movie.language,
        year=movie.year,
        time=movie.time,
        video=movie.video,
        casts=[MovieCast(name=c.name, image=c.image, order_index=i) for i, c in enumerate(movie.casts)],
    )
    db.add(new_movie)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")

    result = await db.execute(_movie_query().where(Movie.id == new_movie.id))
    created = result.scalar_one()
    return await build_movie_response(created, include_video=False)
