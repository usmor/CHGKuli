from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated, List, Optional

from app.core.db import get_async_session
from app.crud import progress_crud, question_crud
from app.core.user import fastapi_users
from app.schemas.progress import UserProgressList
from app.schemas.question import QuestionListResponse, QuestionSort

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.post("/{question_id}/passed/")
async def mark_as_passed(
    question_id: int,
    session: SessionDep,
    current_user=Depends(fastapi_users.current_user(active=True)),
):
    """Отметить вопрос как пройденный."""
    await progress_crud.mark_as_passed(session, current_user.id, question_id)
    await session.commit()
    return {"status": "ok"}


@router.delete("/{question_id}/passed/")
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
    await session.commit()
    return {"status": "ok"}


@router.get("/passed/", response_model=UserProgressList)
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


@router.get("/passed/questions/", response_model=QuestionListResponse)
async def get_passed_questions_full(
    session: SessionDep,
    current_user=Depends(fastapi_users.current_user(active=True)),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    author_ids: Optional[List[int]] = Query(None),
    tournament_ids: Optional[List[int]] = Query(None),
    year_from: Optional[int] = Query(None, ge=1800, le=2100),
    year_to: Optional[int] = Query(None, ge=1800, le=2100),
    sort: QuestionSort = Query(QuestionSort.RANDOM),
):
    """Пройденные вопросы с фильтрами и сортировкой."""
    passed_ids = await progress_crud.get_all_passed_ids(session, current_user.id)

    if not passed_ids:
        return QuestionListResponse(
            items=[],
            total=0,
            next_offset=None,
            has_more=False,
        )

    questions, total = await question_crud.get_multi_with_pagination(
        session,
        skip=offset,
        limit=limit,
        relations=["tournament", "authors"],
        author_ids=author_ids,
        tournament_ids=tournament_ids,
        year_from=year_from,
        year_to=year_to,
        sort=sort.value,
        question_ids=passed_ids,
    )

    return QuestionListResponse(
        items=questions,
        total=total,
        next_offset=offset + limit if offset + limit < total else None,
        has_more=offset + limit < total,
    )
