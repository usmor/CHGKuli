from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_users import exceptions

from app.core.user import auth_backend, fastapi_users, get_user_manager
from app.schemas.user import (DailyCodeResponse, PasswordUpdate,
                              UserCreate,
                              UserRead,
                              UserUpdate,
                              UserStats)
from app.utils.generate_code import generate_daily_code
from app.models.user import User
from app.core.db import get_async_session
from app.crud import user_stats_crud

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


@router.get("/users/me/stats", response_model=UserStats, tags=['users'])
async def get_my_stats(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """Статистика текущего пользователя."""
    return await user_stats_crud.get_stats(session, user)


@router.patch("/users/me/password", tags=["users"])
async def change_password(
    payload: PasswordUpdate,
    user: User = Depends(fastapi_users.current_user(active=True)),
    user_manager=Depends(get_user_manager),
):
    verified, _ = user_manager.password_helper.verify_and_update(
        payload.current_password,
        user.hashed_password,
    )
    if not verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный текущий пароль",
        )

    try:
        await user_manager.update(
            user_update=UserUpdate(password=payload.password),
            user=user,
            safe=False,
        )
    except exceptions.InvalidPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e.reason),
        )

    return {"status": "ok"}
