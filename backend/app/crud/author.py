from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.crud.base import CRUDBase
from app.models.author import Author


class CRUDAuthor(CRUDBase):
    async def search_by_name(
        self,
        session: AsyncSession,
        query: str,
        limit: int = 50,
    ) -> List[Author]:
        """Поиск авторов по имени"""
        result = await session.execute(
            select(Author)
            .where(Author.name.ilike(f"%{query}%"))
            .order_by(Author.name)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_ids(
        self,
        session: AsyncSession,
        ids: List[int],
    ) -> List[Author]:
        """Получить авторов по списку ID"""
        result = await session.execute(select(Author).where(Author.id.in_(ids)))
        return list(result.scalars().all())


author_crud = CRUDAuthor(Author)
