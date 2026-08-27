from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, CommonMixin

if TYPE_CHECKING:
    from app.models.author import Author
    from app.models.tournament import Tournament


class Question(Base, CommonMixin):

    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        doc="Текст вопроса"
    )
    answer: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        doc="Ответ на вопрос"
    )
    pass_criteria: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        doc="Критерии зачета"
    )
    comment: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
        doc="Комментарий к вопросу"
    )

    tournament_id: Mapped[int] = mapped_column(
        ForeignKey("tournament.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        doc="ID турнира"
    )

    tournament: Mapped["Tournament"] = relationship(
        "Tournament",
        back_populates="questions",
        lazy="selectin"
    )

    authors: Mapped[List["Author"]] = relationship(
        "Author",
        secondary="question_author_association",
        back_populates="questions",
        lazy="selectin",
        order_by="Author.id"
    )
