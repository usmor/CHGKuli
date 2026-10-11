from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.progress import UserProgressList
from app.models import UserQuestionProgress


class CRUDProgress:
    async def mark_as_passed(
        self,
        session: AsyncSession,
        user_id: int,
        question_id: int,
    ) -> UserQuestionProgress:
        result = await session.execute(
            select(UserQuestionProgress).where(
                UserQuestionProgress.user_id == user_id,
                UserQuestionProgress.question_id == question_id,
            )
        )
        existing = result.scalar_one_or_none()
        if existing:
            return existing

        progress = UserQuestionProgress(
            user_id=user_id,
            question_id=question_id,
        )
        session.add(progress)
        await session.commit()
        await session.refresh(progress)
        return progress

    async def unmark_as_passed(
        self,
        session: AsyncSession,
        user_id: int,
        question_id: int,
    ) -> bool:
        result = await session.execute(
            delete(UserQuestionProgress).where(
                UserQuestionProgress.user_id == user_id,
                UserQuestionProgress.question_id == question_id,
            )
        )
        await session.commit()
        return result.rowcount > 0

    async def get_user_progress(
        self,
        session: AsyncSession,
        user_id: int,
        question_ids: list[int] | None = None,
    ) -> UserProgressList:
        query = select(UserQuestionProgress.question_id).where(
            UserQuestionProgress.user_id == user_id,
        )
        if question_ids:
            query = query.where(
                UserQuestionProgress.question_id.in_(question_ids),
            )
        result = await session.execute(query)
        question_ids = list(result.scalars().all())
        return UserProgressList(question_ids=question_ids,
                                total=len(question_ids))


progress_crud = CRUDProgress()
