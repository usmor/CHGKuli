from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class GameHidden(Base):
    __tablename__ = "game_hidden"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        primary_key=True,
    )
    game_id: Mapped[int] = mapped_column(
        ForeignKey("game.id", ondelete="CASCADE"),
        primary_key=True,
    )