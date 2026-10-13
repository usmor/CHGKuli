from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base, CommonMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.question import Question


class GameStatus(str, Enum):
    SETUP = "setup"
    ACTIVE = "active"
    FINISHED = "finished"


class Game(Base, CommonMixin):
    __tablename__ = "game"

    owner_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("user.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    guest_token: Mapped[Optional[str]] = mapped_column(
        String(64), nullable=True, index=True, unique=True
    )

    # Метаданные
    title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), default=GameStatus.SETUP.value, nullable=False
    )

    # Настройки
    has_timer: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    time_per_question: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    questions_count: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    filters: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # Результаты
    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    finished_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    answered_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    players: Mapped[List["GamePlayer"]] = relationship(
        "GamePlayer",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    questions: Mapped[List["GameQuestion"]] = relationship(
        "GameQuestion",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
        order_by="GameQuestion.order",
    )

    @property
    def owner(self) -> Optional["GamePlayer"]:
        """Владелец игры"""
        if self.owner_id is None:
            return None
        return next((p for p in self.players if p.user_id == self.owner_id), None)

    @property
    def is_finished(self) -> bool:
        return self.status == GameStatus.FINISHED.value

    __table_args__ = (Index("ix_game_status", "status"),)


class GamePlayer(Base, CommonMixin):
    __tablename__ = "game_player"

    game_id: Mapped[int] = mapped_column(
        ForeignKey("game.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    game: Mapped["Game"] = relationship("Game", back_populates="players")
    user: Mapped["User"] = relationship("User", back_populates="game_participations")

    __table_args__ = (UniqueConstraint("game_id", "user_id", name="uq_game_player"),)


class GameQuestion(Base, CommonMixin):
    __tablename__ = "game_question"

    game_id: Mapped[int] = mapped_column(
        ForeignKey("game.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    question_id: Mapped[int] = mapped_column(
        ForeignKey("question.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_answered: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    time_spent_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    game: Mapped["Game"] = relationship("Game", back_populates="questions")
    question: Mapped["Question"] = relationship("Question", lazy="selectin")

    __table_args__ = (
        UniqueConstraint("game_id", "order", name="uq_game_question_order"),
        Index("ix_game_question_game_order", "game_id", "order"),
    )
