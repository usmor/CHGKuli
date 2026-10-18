from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud import author_crud
from app.schemas.author import Author

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/autocomplete", response_model=List[Author])
async def autocomplete_authors(
    session: SessionDep,
    q: Optional[str] = Query(None),
    ids: Optional[List[int]] = Query(None),
    limit: int = Query(10, ge=1, le=20),
):
    """
    Автокомплит авторов.
    """
    if ids:
        return await author_crud.get_by_ids(session, ids)

    if q:
        return await author_crud.search_by_name(session, q, limit)

    return []


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
