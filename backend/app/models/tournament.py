from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, CommonMixin
if TYPE_CHECKING:
    from app.models.question import Question


class Tournament(Base, CommonMixin):
    name: Mapped[str] = mapped_column(String, nullable=False)
    year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    questions: Mapped[List["Question"]] = relationship(
        "Question",
        back_populates="tournament",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
