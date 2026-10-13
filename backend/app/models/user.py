from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, Date, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, CommonMixin

if TYPE_CHECKING:
    from app.models.question import Question
    from app.models.game import GamePlayer
    from app.models.user_question_progress import UserQuestionProgress


class User(Base, CommonMixin):
    email: Mapped[str] = mapped_column(
        String(320), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[str] = mapped_column(String(1024), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    username: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )

    daily_code: Mapped[Optional[str]] = mapped_column(String(6), nullable=True)
    daily_code_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    passed_questions: Mapped[List["Question"]] = relationship(
        "Question",
        secondary="user_question_progress",
        lazy="selectin",
        viewonly=True,
    )

    progress_records: Mapped[List["UserQuestionProgress"]] = relationship(
        "UserQuestionProgress",
        back_populates="user",
        lazy="selectin",
        viewonly=True,
    )

    game_participations: Mapped[List["GamePlayer"]] = relationship(
        "GamePlayer",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
