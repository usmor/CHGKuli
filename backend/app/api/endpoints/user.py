from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.user import auth_backend, fastapi_users
from app.schemas.user import DailyCodeResponse, UserCreate, UserRead, UserUpdate
from app.utils.generate_code import generate_daily_code
from app.models.user import User
from app.core.db import get_async_session


router = APIRouter()
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)


router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)


router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@router.get("/users/me/daily-code", response_model=DailyCodeResponse,
            tags=['users'])
async def get_my_daily_code(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """
    Получить личный код на сегодня.
    Если код ещё не сгенерирован или устарел, создаётся новый.
    """
    today = date.today()
    if user.daily_code_date != today or not user.daily_code:
        user.daily_code = generate_daily_code()
        user.daily_code_date = today
        session.add(user)
        await session.commit()
        await session.refresh(user)
    return DailyCodeResponse(daily_code=user.daily_code)
