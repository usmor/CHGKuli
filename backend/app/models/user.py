from typing import List

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, CommonMixin
from app.models.question import Question


class User(Base, CommonMixin):
    __tablename__ = "users"

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

    passed_questions: Mapped[List["Question"]] = relationship(
        "Question",
        secondary="user_question_progress",
        lazy="selectin",
    )
