from datetime import date
from typing import Optional, List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
import random

from app.crud.base import CRUDBase
from app.models import Question, Tournament, question_author_association


class CRUDQuestion(CRUDBase):

    async def get_random_set(
        self,
        session: AsyncSession,
        count: int = 10,
        author_id: Optional[int] = None,
        tournament_id: Optional[int] = None,
        year_from: Optional[int] = None,
        year_to: Optional[int] = None,
        relations: Optional[List[str]] = None,
    ) -> List[Question]:
        """
        Получить случайный набор вопросов с фильтрами.
        """
        query = select(Question)

        # Фильтр по автору (через связующую таблицу)
        if author_id:
            query = query.join(
                question_author_association,
                question_author_association.c.question_id == Question.id,
            ).where(question_author_association.c.author_id == author_id)

        # Фильтр по турниру
        if tournament_id:
            query = query.where(Question.tournament_id == tournament_id)

        # Фильтр по году (через турнир)
        if year_from or year_to:
            query = query.join(Question.tournament)
            if year_from:
                query = query.where(Tournament.year >= year_from)
            if year_to:
                query = query.where(Tournament.year <= year_to)

        count_result = await session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar()

        if total == 0:
            return []

        offset = random.randint(0, max(0, total - count))

        if relations:
            options = [selectinload(getattr(Question, rel))
                       for rel in relations]
            query = query.options(*options)

        query = query.offset(offset).limit(count)
        result = await session.execute(query)

        return list(result.scalars().all())

    async def get_daily_set(
        self,
        session: AsyncSession,
        count: int = 10,
        relations: Optional[List[str]] = None,
    ) -> List[Question]:
        """
        Вопросы дня: один и тот же набор в течение дня, новый — на следующий.
        """
        ids_result = await session.execute(select(Question.id))
        all_ids = list(ids_result.scalars().all())

        if not all_ids:
            return []

        today_seed = int(date.today().strftime("%Y%m%d"))
        rng = random.Random(today_seed)

        selected_ids = rng.sample(all_ids, min(count, len(all_ids)))

        query = select(Question).where(Question.id.in_(selected_ids))
        if relations:
            options = [selectinload(getattr(Question, rel)) for rel 
                       in relations]
            query = query.options(*options)

        result = await session.execute(query)
        return list(result.scalars().all())


question_crud = CRUDQuestion(Question)
