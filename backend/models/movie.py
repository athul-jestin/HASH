import uuid

from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.base import Base, TimestampMixin, UUIDPKMixin


class Movie(Base, UUIDPKMixin, TimestampMixin):
    __tablename__ = "movies"

    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False
    )

    name: Mapped[str] = mapped_column(String, nullable=False)
    desc: Mapped[str] = mapped_column(Text, nullable=False)
    title_image: Mapped[str] = mapped_column(String, nullable=False)
    image: Mapped[str] = mapped_column(String, nullable=False)
    language: Mapped[str] = mapped_column(String, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    time: Mapped[int] = mapped_column(Integer, nullable=False)
    video: Mapped[str | None] = mapped_column(String, nullable=True)
    rate: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    number_of_reviews: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    category = relationship("Category")
    casts = relationship(
        "MovieCast", cascade="all, delete-orphan", order_by="MovieCast.order_index", passive_deletes=True
    )
    reviews = relationship("Review", cascade="all, delete-orphan", passive_deletes=True)
