from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base
from app.models.question import Question
from app.models.user import User


class UserQuestionProgress(Base):
    __tablename__ = "user_question_progress"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    question_id: Mapped[int] = mapped_column(
        ForeignKey("question.id", ondelete="CASCADE"),
        primary_key=True,
        index=True,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="progress_records",
    )

    question: Mapped["Question"] = relationship("Question", lazy="selectin")
