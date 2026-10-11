# mypy: disable-error-code="type-var,override,attr-defined"
from typing import Optional

from fastapi import Depends, Request
from fastapi_users import (
    BaseUserManager,
    FastAPIUsers,
    IntegerIDMixin,
    InvalidPasswordException,
    exceptions,
)
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.db import get_async_session
from app.models import User
from app.schemas.user import UserCreate


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


bearer_transport = BearerTransport(tokenUrl="/api/v1/auth/jwt/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.secret, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    async def validate_password(
        self,
        password: str,
        user,
    ) -> None:
        if len(password) < 6:
            raise InvalidPasswordException(
                reason="Пароль должен быть не короче 6 символов"
            )
        if user.email in password:
            raise InvalidPasswordException(reason="Пароль не должен содержать email")

    async def create(
        self,
        user_create: UserCreate,
        safe: bool = False,
        request: Optional[Request] = None,
    ) -> User:
        """Проверяем username на уникальность, потом вызываем родителя."""
        result = await self.user_db.session.execute(
            select(User).where(User.username == user_create.username)
        )
        if result.scalar_one_or_none():
            raise exceptions.UserAlreadyExists()

        return await super().create(user_create, safe=safe, request=request)

    async def on_after_register(
        self,
        user: User,
        request: Optional[Request] = None,
    ) -> None:
        print(f"Пользователь {user.email} зарегистрирован.")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)
