from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.db import get_database
from backend.dependencies import get_current_admin, get_current_user
from backend.schemas.movie import MovieCreate, MovieReviewCreate, MovieUpdate
from backend.utils import prepare_object_id, to_json

router = APIRouter(tags=["movies"])


@router.get("/movies")
async def get_movies(
    category: str | None = None,
    time: int | None = None,
    language: str | None = None,
    rate: int | None = None,
    year: int | None = None,
    search: str | None = None,
    pageNumber: int = Query(1, alias="pageNumber"),
):
    db = get_database()
    query = {}
    if category:
        query["category"] = category
    if time is not None:
        query["time"] = time
    if language:
        query["language"] = language
    if rate is not None:
        query["rate"] = rate
    if year is not None:
        query["year"] = year
    if search:
        query["name"] = {"$regex": search, "$options": "i"}

    limit = 10
    skip = (pageNumber - 1) * limit
    cursor = db.movies.find(query).sort("createdAt", -1).skip(skip).limit(limit)
    movies = [to_json(movie) for movie in await cursor.to_list(length=limit)]
    count = await db.movies.count_documents(query)
    return {
        "movies": movies,
        "page": pageNumber,
        "pages": (count + limit - 1) // limit,
        "totalMovies": count,
    }


@router.get("/movies/{movie_id}")
async def get_movie(movie_id: str):
    db = get_database()
    movie = await db.movies.find_one({"_id": prepare_object_id(movie_id)})
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return to_json(movie)


@router.get("/movies/rated/top")
async def get_top_rated_movies():
    db = get_database()
    cursor = db.movies.find({}).sort("rate", -1)
    return [to_json(movie) for movie in await cursor.to_list(length=100)]


@router.get("/movies/random/all")
async def get_random_movies():
    db = get_database()
    pipeline = [{"$sample": {"size": 8}}]
    cursor = db.movies.aggregate(pipeline)
    movies = [to_json(movie) for movie in await cursor.to_list(length=8)]
    return movies


@router.post("/movies/{movie_id}/reviews", status_code=status.HTTP_201_CREATED)
async def create_movie_review(
    movie_id: str,
    review: MovieReviewCreate,
    current_user: dict = Depends(get_current_user),
):
    db = get_database()
    movie = await db.movies.find_one({"_id": prepare_object_id(movie_id)})
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    already_reviewed = any(
        existing.get("userId") == current_user["id"]
        for existing in movie.get("reviews", [])
    )
    if already_reviewed:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already rate this movie")

    new_review = {
        "userName": current_user.get("fullName"),
        "userImage": current_user.get("image"),
        "rating": review.rating,
        "comment": review.comment,
        "userId": prepare_object_id(current_user["id"]),
    }
    reviews = movie.get("reviews", [])
    reviews.append(new_review)
    number_of_reviews = len(reviews)
    total_rating = sum(item.get("rating", 0) for item in reviews)
    rate = total_rating / number_of_reviews if number_of_reviews else 0

    await db.movies.update_one(
        {"_id": movie["_id"]},
        {
            "$set": {
                "reviews": reviews,
                "numberOfReviews": number_of_reviews,
                "rate": rate,
            }
        },
    )
    return {"message": "Review added"}


@router.delete("/movies", dependencies=[Depends(get_current_admin)])
async def delete_all_movies():
    db = get_database()
    await db.movies.delete_many({})
    return {"message": "All movies removed"}


@router.put("/movies/{movie_id}", dependencies=[Depends(get_current_admin)])
async def update_movie(movie_id: str, payload: MovieUpdate):
    db = get_database()
    update_data = {k: v for k, v in payload.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No values to update")

    await db.movies.update_one({"_id": prepare_object_id(movie_id)}, {"$set": update_data})
    movie = await db.movies.find_one({"_id": prepare_object_id(movie_id)})
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return to_json(movie)


@router.delete("/movies/{movie_id}", dependencies=[Depends(get_current_admin)])
async def delete_movie(movie_id: str):
    db = get_database()
    result = await db.movies.delete_one({"_id": prepare_object_id(movie_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
    return {"message": "Movie removed"}


@router.post("/movies", dependencies=[Depends(get_current_admin)], status_code=status.HTTP_201_CREATED)
async def create_movie(movie: MovieCreate, current_user: dict = Depends(get_current_admin)):
    db = get_database()
    movie_data = movie.dict()
    movie_data["userId"] = prepare_object_id(current_user["id"])
    movie_data["reviews"] = []
    movie_data["rate"] = movie_data.get("rate", 0)
    movie_data["numberOfReviews"] = movie_data.get("numberOfReviews", 0)
    result = await db.movies.insert_one(movie_data)
    created_movie = await db.movies.find_one({"_id": result.inserted_id})
    return to_json(created_movie)
