from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, CommonMixin
if TYPE_CHECKING:
    from app.models.question import Question


class Tournament(Base, CommonMixin):
    name: Mapped[str] = mapped_column(String, nullable=False)
    date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    questions: Mapped[List["Question"]] = relationship(
        "Question",
        back_populates="tournament",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
