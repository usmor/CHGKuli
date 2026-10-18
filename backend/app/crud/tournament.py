from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.crud.base import CRUDBase
from app.models.tournament import Tournament


class CRUDTournament(CRUDBase):
    async def search_by_name(
        self,
        session: AsyncSession,
        query: str,
        limit: int = 10,
    ) -> List[Tournament]:
        """Поиск турниров по имени"""
        result = await session.execute(
            select(Tournament)
            .where(Tournament.name.ilike(f"%{query}%"))
            .order_by(Tournament.name)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_ids(
        self,
        session: AsyncSession,
        ids: List[int],
    ) -> List[Tournament]:
        """Получить турниры по списку ID"""
        result = await session.execute(select(Tournament).where(Tournament.id.in_(ids)))
        return list(result.scalars().all())


tournament_crud = CRUDTournament(Tournament)
