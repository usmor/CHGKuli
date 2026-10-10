from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud import tournament_crud
from app.schemas.tournament import Tournament

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/autocomplete", response_model=List[Tournament])
async def autocomplete_tournaments(
    session: SessionDep,
    q: Optional[str] = Query(None, min_length=2),
    ids: Optional[List[int]] = Query(None),
    limit: int = Query(10, ge=1, le=20),
):
    """
    Автокомплит турниров.
    """
    if ids:
        return await tournament_crud.get_by_ids(session, ids)

    if q:
        return await tournament_crud.search_by_name(session, q, limit)

    return []


@router.get("/", response_model=list[Tournament])
async def get_tournaments(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Получить все турниры"""
    tournaments = await tournament_crud.get_multi(session)
    return tournaments[skip : skip + limit]


@router.get("/{tournament_id}", response_model=Tournament)
async def get_tournament(tournament_id: int, session: SessionDep):
    """Получить турнир по ID"""
    tournament = await tournament_crud.get(tournament_id, session)
    if not tournament:
        raise HTTPException(status_code=404, detail="Турнир не найден")
    return tournament
