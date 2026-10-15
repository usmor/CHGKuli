from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud.stats import stats_crud
from app.schemas.stats import SiteStats

router = APIRouter()


@router.get("/", response_model=SiteStats)
async def get_site_stats(
    session: AsyncSession = Depends(get_async_session),
):
    """Общая статистика базы."""
    return await stats_crud.get_site_stats(session)
