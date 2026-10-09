from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud import tournament_crud
from app.schemas.tournament import Tournament

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


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


@router.get("/tournaments/autocomplete", response_model=list[str])
async def autocomplete_tournaments(
    session: SessionDep,
    q: str = Query(..., min_length=1, description="Поисковый запрос"),
    limit: int = Query(10, ge=1, le=50),
):
    """Автодополнение названий турниров (возвращает только названия)"""
    return await tournament_crud.get_names_by_query(session, q, limit)
