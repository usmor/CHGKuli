from datetime import datetime, timezone

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Game,
    GamePlayer,
    User,
    UserQuestionProgress,
)
from app.schemas.user import UserStats
from app.models.game import GameStatus


class CRUDUserStats:
    async def get_stats(
        self,
        session: AsyncSession,
        user: User,
    ) -> UserStats:
        """Статистика пользователя"""
        #  Пройденные вопросы
        passed_result = await session.execute(
            select(func.count())
            .select_from(UserQuestionProgress)
            .where(UserQuestionProgress.user_id == user.id)
        )
        questions_passed = passed_result.scalar() or 0

        # Количество игр (владелец или участник)
        games_result = await session.execute(
            select(func.count(func.distinct(Game.id)))
            .select_from(Game)
            .outerjoin(GamePlayer, GamePlayer.game_id == Game.id)
            .where(
                or_(
                    Game.owner_id == user.id,
                    GamePlayer.user_id == user.id,
                ),
                Game.status == GameStatus.FINISHED.value,
            )
        )
        games_played = games_result.scalar() or 0

        time_result = await session.execute(
            select(
                func.coalesce(
                    func.sum(
                        func.extract('epoch', Game.finished_at - Game.started_at)
                    ),
                    0,
                )
            )
            .select_from(Game)
            .outerjoin(GamePlayer, GamePlayer.game_id == Game.id)
            .where(
                or_(
                    Game.owner_id == user.id,
                    GamePlayer.user_id == user.id,
                ),
                Game.status == GameStatus.FINISHED.value,
                Game.started_at.isnot(None),
                Game.finished_at.isnot(None),
            )
        )
        total_time_seconds = int(time_result.scalar() or 0)

        # Дней с регистрации
        now = datetime.now(timezone.utc)
        created = user.created_at
        if created is not None and created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        days_since_registration = (
            (now - created).days if created is not None else 0
        )

        return UserStats(
            questions_passed=questions_passed,
            games_played=games_played,
            registered_at=user.created_at or now,
            days_since_registration=days_since_registration,
            total_time_seconds=total_time_seconds,
        )


user_stats_crud = CRUDUserStats()
