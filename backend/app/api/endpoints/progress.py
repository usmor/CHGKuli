from typing import Annotated
from app.core.user import fastapi_users
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.models import User, UserQuestionProgress, Question

router = APIRouter()

SessionDep = Annotated[AsyncSession, Depends(get_async_session)]


@router.get("/me/passed", response_model=list[int])
async def get_passed_question_ids(
    session: SessionDep,
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """Список ID пройденных вопросов текущего пользователя."""
    result = await session.execute(
        select(UserQuestionProgress.question_id).where(
            UserQuestionProgress.user_id == user.id
        )
    )
    return list(result.scalars().all())


@router.post("/me/passed/{question_id}", status_code=204)
async def mark_question_passed(
    session: SessionDep,
    question_id: int,
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """Отметить вопрос как пройденный."""
    question = await session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    existing = await session.get(
        UserQuestionProgress,
        {"user_id": user.id, "question_id": question_id},
    )
    if existing:
        return

    progress = UserQuestionProgress(user_id=user.id, question_id=question_id)
    session.add(progress)
    await session.commit()


@router.delete("/me/passed/{question_id}", status_code=204)
async def unmark_question_passed(
    session: SessionDep,
    question_id: int,
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """Снять отметку с вопроса."""
    await session.execute(
        delete(UserQuestionProgress).where(
            UserQuestionProgress.user_id == user.id,
            UserQuestionProgress.question_id == question_id,
        )
    )
    await session.commit()
