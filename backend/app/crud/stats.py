from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Author, Question, Tournament
from app.schemas.stats import SiteStats


class CRUDStats:
    async def get_site_stats(self, session: AsyncSession) -> SiteStats:
        questions = (
            await session.execute(select(func.count()).select_from(Question))
        ).scalar() or 0

        authors = (
            await session.execute(select(func.count()).select_from(Author))
        ).scalar() or 0

        tournaments = (
            await session.execute(select(func.count()).select_from(Tournament))
        ).scalar() or 0

        return SiteStats(
            questions=questions,
            authors=authors,
            tournaments=tournaments,
        )


stats_crud = CRUDStats()
