from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated, List, Optional

from app.core.db import get_async_session
from app.crud import progress_crud
from app.core.user import fastapi_users
from app.schemas.progress import UserProgressList

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.post("/{question_id}/passed")
async def mark_as_passed(
    question_id: int,
    session: SessionDep,
    current_user=Depends(fastapi_users.current_user(active=True)),
):
    """Отметить вопрос как пройденный."""
    await progress_crud.mark_as_passed(session, current_user.id, question_id)
    return {"status": "ok"}


@router.delete("/{question_id}/passed")
async def unmark_as_passed(
    question_id: int,
    session: SessionDep,
    current_user=Depends(fastapi_users.current_user(active=True)),
):
    """Снять отметку пройденного."""
    deleted = await progress_crud.unmark_as_passed(
        session, current_user.id, question_id
    )
    if not deleted:
        raise HTTPException(404, "Отметка не найдена")
    return {"status": "ok"}


@router.get("/passed", response_model=UserProgressList)
async def get_passed_questions(
    session: SessionDep,
    current_user=Depends(fastapi_users.current_user(active=True)),
    question_ids: Optional[List[int]] = Query(None),
):
    """Список ID пройденных вопросов."""
    return await progress_crud.get_user_progress(
        session,
        current_user.id,
        question_ids,
    )
