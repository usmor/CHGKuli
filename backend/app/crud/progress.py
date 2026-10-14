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
        await session.flush()
        return progress

    async def mark_many_as_passed(
        self,
        session: AsyncSession,
        user_ids: list[int],
        question_ids: list[int],
    ) -> int:
        """
        Пометить все пары (user_id, question_id) как пройденные.
        Возвращает количество вставленных строк.
        """
        if not user_ids or not question_ids:
            return 0

        user_ids = list(set(user_ids))
        question_ids = list(set(question_ids))

        existing_result = await session.execute(
            select(
                UserQuestionProgress.user_id,
                UserQuestionProgress.question_id,
            ).where(
                UserQuestionProgress.user_id.in_(user_ids),
                UserQuestionProgress.question_id.in_(question_ids),
            )
        )
        existing = {(r.user_id, r.question_id) for r in existing_result}

        new_rows = [
            UserQuestionProgress(user_id=uid, question_id=qid)
            for uid in user_ids
            for qid in question_ids
            if (uid, qid) not in existing
        ]
        if not new_rows:
            return 0

        session.add_all(new_rows)
        await session.flush()
        return len(new_rows)

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
        await session.flush()
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
        return UserProgressList(question_ids=question_ids, total=len(question_ids))

    async def get_passed_question_ids_for_users(
        self,
        session: AsyncSession,
        user_ids: list[int],
    ) -> set[int]:
        """ID вопросов, которые проходил хотя бы один из указанных пользователей."""
        if not user_ids:
            return set()

        result = await session.execute(
            select(UserQuestionProgress.question_id).where(
                UserQuestionProgress.user_id.in_(user_ids)
            )
        )
        return set(result.scalars().all())

    async def get_all_passed_ids(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> list[int]:
        """Все id вопросов, пройденных пользователем."""
        result = await session.execute(
            select(UserQuestionProgress.question_id).where(
                UserQuestionProgress.user_id == user_id,
            )
        )
        return list(result.scalars().all())


progress_crud = CRUDProgress()
