from typing import Optional

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import get_async_session
from app.core.user import fastapi_users
from app.crud.game import game_crud
from app.models import Game, User
from app.models.game import GameStatus


async def get_game_for_user(
    game_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: Optional[User] = Depends(
        fastapi_users.current_user(active=True, optional=True)
    ),
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
) -> Game:
    """Доступ: владелец, участник или гость по токену."""
    game = await game_crud.get_with_relations(game_id, session)
    if not game:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Игра не найдена")

    if user and game.owner_id == user.id:
        return game
    if user and any(p.user_id == user.id for p in game.players):
        return game
    if x_guest_token and game.guest_token == x_guest_token:
        return game

    raise HTTPException(status.HTTP_403_FORBIDDEN, "Нет доступа к игре")


async def get_game_for_owner(
    game_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: Optional[User] = Depends(fastapi_users.current_user(active=True, optional=True)),
    x_guest_token: Optional[str] = Header(None, alias="X-Guest-Token"),
) -> Game:
    """Только владелец или гость по токену."""
    game = await game_crud.get_with_relations(game_id, session)
    if not game:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Игра не найдена")

    if user and game.owner_id == user.id:
        return game
    if x_guest_token and game.guest_token == x_guest_token:
        return game

    raise HTTPException(
        status.HTTP_403_FORBIDDEN, "Только владелец может управлять игрой"
    )


async def get_setup_game_for_owner(
    game: Game = Depends(get_game_for_owner),
) -> Game:
    """Владелец + статус SETUP."""
    if game.status != GameStatus.SETUP.value:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Игра уже начата или завершена"
        )
    return game
