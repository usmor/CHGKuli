from typing import Annotated, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud import question_crud
from app.schemas.question import (
    Question,
    QuestionListResponse,
    QuestionSetRequest,
    QuestionSort,
)

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("", response_model=QuestionListResponse)
async def get_all_questions(
    session: SessionDep,
    offset: int = Query(0, ge=0, description="Смещение"),
    limit: int = Query(20, ge=1, le=100, description="Сколько за раз"),
    author_ids: Optional[List[int]] = Query(None),
    tournament_ids: Optional[List[int]] = Query(None),
    year_from: Optional[int] = Query(None, ge=1800, le=2100, description="Год от"),
    year_to: Optional[int] = Query(None, ge=1800, le=2100, description="Год до"),
    sort: QuestionSort = Query(QuestionSort.RANDOM),
):
    """Получить все вопросы с бесконечной прокруткой"""
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
    )

    return QuestionListResponse(
        items=questions,
        total=total,
        next_offset=offset + limit if offset + limit < total else None,
        has_more=offset + limit < total,
    )


@router.get("/daily", response_model=list[Question])
async def get_daily_set(session: SessionDep, count: int = Query(10, ge=1, le=50)):
    questions = await question_crud.get_daily_set(
        count=count, session=session, relations=["tournament", "authors"]
    )

    return questions


@router.post("/set", response_model=list[Question])
async def get_question_set(
    request: QuestionSetRequest,
    session: SessionDep,
):
    """
    Получить случайный набор вопросов с фильтрами.
    """
    questions = await question_crud.get_random_set(
        session,
        count=request.count,
        author_ids=request.author_ids or None,
        tournament_ids=request.tournament_ids or None,
        year_from=request.year_from,
        year_to=request.year_to,
        relations=["tournament", "authors"],
    )

    if not questions:
        raise HTTPException(status_code=404, detail="Вопросы не найдены")

    return questions


@router.get("/{question_id}", response_model=Question)
async def get_question(question_id: int, session: SessionDep):
    """Получить вопрос по ID"""
    question = await question_crud.get(question_id, session)
    if not question:
        raise HTTPException(status_code=404, detail="Вопрос не найден")
    return question
