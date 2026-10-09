from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud import author_crud
from app.schemas.author import Author

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/", response_model=list[Author])
async def get_authors(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Получить всех авторов"""
    authors = await author_crud.get_multi(session)
    return authors[skip : skip + limit]


@router.get("/{author_id}", response_model=Author)
async def get_author(
    session: SessionDep,
    author_id: int,
):
    """Получить автора по ID"""
    author = await author_crud.get(author_id, session)
    if not author:
        raise HTTPException(status_code=404, detail="Автор не найден")
    return author


@router.get("/authors/autocomplete", response_model=list[str])
async def autocomplete_authors(
    session: SessionDep,
    q: str = Query(..., min_length=1, description="Поисковый запрос"),
    limit: int = Query(10, ge=1, le=50),
):
    """Автодополнение имен авторов (возвращает только имена)"""
    return await author_crud.get_names_by_query(session, q, limit)
