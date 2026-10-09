from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.tournament import Tournament


class CRUDTournament(CRUDBase):
    async def get_names_by_query(
        self, session: AsyncSession, query: str, limit: int = 10
    ) -> list[str]:
        """Получить только названия турниров по поисковому запросу"""
        result = await session.execute(
            select(Tournament.name)
            .where(Tournament.name.ilike(f"%{query}%"))
            .limit(limit)
        )
        return result.scalars().all()


tournament_crud = CRUDTournament(Tournament)
