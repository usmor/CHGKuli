from datetime import date, datetime, timezone
from typing import List, Optional, Tuple

from fastapi import HTTPException
from sqlalchemy import exists, or_, select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.crud.base import CRUDBase
from app.models import Game, GamePlayer, GameQuestion, User
from app.models.game import GameStatus


class CRUDGame(CRUDBase):
    async def get_with_relations(
        self,
        game_id: int,
        session: AsyncSession,
    ) -> Optional[Game]:
        result = await session.execute(
            select(Game)
            .options(
                selectinload(Game.players).selectinload(GamePlayer.user),
                selectinload(Game.questions).selectinload(GameQuestion.question),
            )
            .where(Game.id == game_id)
            .execution_options(populate_existing=True)
        )
        return result.scalar_one_or_none()

    async def get_with_relations_or_404(self, game_id, session) -> Game:
        game = await self.get_with_relations(game_id, session)
        if game is None:
            raise HTTPException(404, "Игра не найдена")
        return game

    async def get_by_guest_token(
        self,
        session: AsyncSession,
        guest_token: str,
    ) -> Optional[Game]:
        result = await session.execute(
            select(Game)
            .options(
                selectinload(Game.players).selectinload(GamePlayer.user),
                selectinload(Game.questions).selectinload(GameQuestion.question),
            )
            .where(Game.guest_token == guest_token)
        )
        return result.scalar_one_or_none()

    async def get_user_games(
        self,
        session: AsyncSession,
        user_id: int,
        limit: int = 20,
        offset: int = 0,
    ) -> Tuple[List[Game], int]:
        participant_exists = exists().where(
            GamePlayer.game_id == Game.id,
            GamePlayer.user_id == user_id,
        )

        where_clause = or_(
            Game.owner_id == user_id,
            participant_exists,
        )

        count_result = await session.execute(
            select(func.count())
            .select_from(Game)
            .where(where_clause)
        )
        total = count_result.scalar() or 0

        result = await session.execute(
            select(Game)
            .where(where_clause)
            .options(selectinload(Game.players).selectinload(GamePlayer.user))
            .order_by(Game.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        return list(result.scalars().all()), total

    async def create_game(
        self,
        session: AsyncSession,
        *,
        owner_id: Optional[int],
        guest_token: Optional[str],
        title: Optional[str],
        has_timer: bool,
        time_per_question: Optional[int],
        questions_count: int,
        filters: Optional[dict],
    ) -> Game:
        game = Game(
            owner_id=owner_id,
            guest_token=guest_token,
            title=title,
            status=GameStatus.SETUP.value,
            has_timer=has_timer,
            time_per_question=time_per_question,
            questions_count=questions_count,
            filters=filters,
        )
        session.add(game)
        await session.flush()
        return game

    async def update_settings(
        self,
        session: AsyncSession,
        game: Game,
        *,
        title: Optional[str] = None,
        has_timer: Optional[bool] = None,
        time_per_question: Optional[int] = None,
        questions_count: Optional[int] = None,
        filters: Optional[dict] = None,
    ) -> Game:
        if title is not None:
            game.title = title
        if has_timer is not None:
            game.has_timer = has_timer
        if time_per_question is not None:
            game.time_per_question = time_per_question
        if questions_count is not None:
            game.questions_count = questions_count
        if filters is not None:
            game.filters = filters
        await session.flush()
        return game

    async def attach_questions(
        self,
        session: AsyncSession,
        game: Game,
        question_ids: List[int],
    ) -> List[GameQuestion]:
        items = [
            GameQuestion(game_id=game.id, question_id=qid, order=i)
            for i, qid in enumerate(question_ids, start=1)
        ]
        session.add_all(items)
        await session.flush()
        return items

    async def add_player(
        self,
        session: AsyncSession,
        game: Game,
        username: str,
        daily_code: str,
    ) -> GamePlayer:
        target_user = (
            await session.execute(select(User).where(User.username == username))
        ).scalar_one_or_none()
        if not target_user:
            raise ValueError("Пользователь не найден")

        today = date.today()
        if target_user.daily_code_date != today or target_user.daily_code != daily_code:
            raise ValueError("Неверный личный код")

        exists = (
            await session.execute(
                select(GamePlayer).where(
                    GamePlayer.game_id == game.id,
                    GamePlayer.user_id == target_user.id,
                )
            )
        ).scalar_one_or_none()
        if exists:
            raise ValueError("Игрок уже в игре")

        player = GamePlayer(game_id=game.id, user_id=target_user.id)
        session.add(player)
        await session.flush()
        return player

    async def remove_player(
        self,
        session: AsyncSession,
        game_id: int,
        user_id: int,
    ) -> bool:
        result = await session.execute(
            delete(GamePlayer).where(
                GamePlayer.game_id == game_id,
                GamePlayer.user_id == user_id,
            )
        )
        return result.rowcount > 0

    async def start_game(
        self,
        session: AsyncSession,
        game: Game,
        question_ids: List[int],
    ) -> Game:
        if game.status != GameStatus.SETUP.value:
            raise ValueError("Игра уже начата или завершена")
        await self.attach_questions(session, game, question_ids)
        game.status = GameStatus.ACTIVE.value
        game.started_at = datetime.now(timezone.utc)
        await session.flush()
        return game

    async def finish_game(
        self,
        session: AsyncSession,
        game: Game,
    ) -> Game:
        game.status = GameStatus.FINISHED.value
        game.finished_at = datetime.now(timezone.utc)
        await session.flush()
        return game

    async def claim_guest_game(
        self,
        session: AsyncSession,
        game: Game,
        user_id: int,
    ) -> Game:
        game.owner_id = user_id
        game.guest_token = None

        exists = (
            await session.execute(
                select(GamePlayer).where(
                    GamePlayer.game_id == game.id,
                    GamePlayer.user_id == user_id,
                )
            )
        ).scalar_one_or_none()
        if not exists:
            session.add(GamePlayer(game_id=game.id, user_id=user_id))

        await session.flush()
        return game


game_crud = CRUDGame(Game)
