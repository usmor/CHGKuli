from typing import TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.db import Base

ModelType = TypeVar("ModelType", bound=Base)


class CRUDBase:
    def __init__(self, model):
        self.model = model

    async def get(
        self,
        obj_id: int,
        session: AsyncSession,
    ):
        db_obj = await session.execute(
            select(self.model).where(self.model.id == obj_id)
        )
        return db_obj.scalars().first()

    async def get_multi(self, session: AsyncSession):
        db_objs = await session.execute(select(self.model))
        return db_objs.scalars().all()

    async def get_multi_with_pagination(
        self,
        session: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        relations: list[str] | None = None,
    ) -> tuple[list[ModelType], int]:
        """Для бесконечной прокрутки - вопросы с пагинацией"""
        query = select(self.model)

        if relations:
            options = [selectinload(getattr(self.model, rel)) for rel in relations]
            query = query.options(*options)

        count_result = await session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = count_result.scalar()

        query = query.offset(skip).limit(limit)
        result = await session.execute(query)
        items = result.scalars().all()

        return items, total

    async def get_random_with_filters(
        self,
        session: AsyncSession,
        count: int = 10,
        relations: list[str] | None = None,
        **filters,
    ) -> list[ModelType]:
        """Для случайного набора - вопросы с фильтрами"""
        query = select(self.model)

        for key, value in filters.items():
            if value is not None:
                query = query.where(getattr(self.model, key) == value)

        if relations:
            options = [selectinload(getattr(self.model, rel)) for rel in relations]
            query = query.options(*options)

        total_result = await session.execute(
            select(func.count()).select_from(query.subquery())
        )
        total = total_result.scalar()

        if total == 0:
            return []

        import random

        offset = random.randint(0, max(0, total - count))
        query = query.offset(offset).limit(count)

        result = await session.execute(query)
        return result.scalars().all()
