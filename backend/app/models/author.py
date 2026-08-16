from typing import List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base, CommonMixin
from app.models.question import Question


class Author(Base, CommonMixin):
    name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    questions: Mapped[List["Question"]] = relationship(
        "Question",
        secondary="question_author_association",
        back_populates="authors",
        lazy="selectin",
        order_by="Question.id"
    )
