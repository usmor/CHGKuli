from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.crud.base import CRUDBase
from app.models.author import Author


class CRUDAuthor(CRUDBase):

    async def get_names_by_query(
        self,
        session: AsyncSession,
        query: str,
        limit: int = 10
    ) -> List[str]:
        """Получить только имена авторов по поисковому запросу"""
        result = await session.execute(
            select(Author.name).where(
                Author.name.ilike(f"%{query}%")
            ).limit(limit)
        )
        return result.scalars().all()


author_crud = CRUDAuthor(Author)
