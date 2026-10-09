from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.crud import question_crud
from app.schemas.question import Question, QuestionListResponse, QuestionSetRequest

router = APIRouter()
SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/", response_model=QuestionListResponse)
async def get_all_questions(
    session: SessionDep,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """Получить все вопросы с бесконечной прокруткой"""
    questions, total = await question_crud.get_multi_with_pagination(
        session, skip=offset, limit=limit, relations=["tournament", "authors"]
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
async def get_question_set(request: QuestionSetRequest, session: SessionDep):
    """
    Получить случайный набор вопросов с фильтрами.
    """
    questions = await question_crud.get_random_set(
        session,
        count=request.count,
        author_id=request.author_id,
        tournament_id=request.tournament_id,
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
