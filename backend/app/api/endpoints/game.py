import secrets
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.user import fastapi_users
from app.api.deps.game import (
    get_game_for_owner,
    get_game_for_user,
    get_setup_game_for_owner,
)
from app.core.db import get_async_session
from app.crud.game import game_crud
from app.crud.progress import progress_crud
from app.crud.question import question_crud
from app.models import Game, GamePlayer, User
from app.models.game import GameStatus
from app.schemas.game import (
    Game as GameSchema,
    GameAnswer,
    GameClaim,
    GameCreate,
    GamePlayerAdd,
    GamePlayerShort,
    GameSettingsUpdate,
    GameShort,
    GameWithToken,
)

router = APIRouter()


@router.post("/", response_model=GameWithToken, status_code=status.HTTP_201_CREATED)
async def create_game(
    payload: GameCreate,
    session: AsyncSession = Depends(get_async_session),
    user: Optional[User] = Depends(
        fastapi_users.current_user(active=True, optional=True)
    ),
):
    """Создать игру в статусе SETUP. Вопросы подбираются при старте."""
    if user:
        owner_id, guest_token = user.id, None
    else:
        owner_id, guest_token = None, secrets.token_urlsafe(32)

    game = await game_crud.create_game(
        session,
        owner_id=owner_id,
        guest_token=guest_token,
        title=payload.title,
        has_timer=payload.has_timer,
        time_per_question=payload.time_per_question,
        questions_count=payload.questions_count,
        filters=payload.filters.model_dump() if payload.filters else None,
    )

    if user:
        session.add(GamePlayer(game_id=game.id, user_id=user.id))

    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)

    return GameWithToken(
        game=GameSchema.from_orm_game(game),
        guest_token=guest_token,
    )


@router.patch("/{game_id}", response_model=GameSchema)
async def update_game_settings(
    payload: GameSettingsUpdate,
    game: Game = Depends(get_setup_game_for_owner),
    session: AsyncSession = Depends(get_async_session),
):
    """Обновить настройки."""
    await game_crud.update_settings(
        session,
        game,
        title=payload.title,
        has_timer=payload.has_timer,
        time_per_question=payload.time_per_question,
        questions_count=payload.questions_count,
        filters=payload.filters.model_dump() if payload.filters else None,
    )
    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)
    return GameSchema.from_orm_game(game)


@router.get("/my", response_model=list[GameShort])
async def get_my_games(
    limit: int = 20,
    offset: int = 0,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    games, _ = await game_crud.get_user_games(
        session, user_id=user.id, limit=limit, offset=offset
    )
    return games


@router.get("/{game_id}", response_model=GameSchema)
async def get_game(
    game: Game = Depends(get_game_for_user),
):
    return GameSchema.from_orm_game(game)


@router.post("/{game_id}/players", response_model=GamePlayerShort, status_code=201)
async def add_player(
    payload: GamePlayerAdd,
    game: Game = Depends(get_setup_game_for_owner),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """Только владелец, только SETUP."""
    if game.owner_id != user.id:
        raise HTTPException(403, "Только владелец может добавлять игроков")

    try:
        player = await game_crud.add_player(
            session, game, payload.username, payload.daily_code
        )
    except ValueError as e:
        raise HTTPException(400, str(e))

    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)
    player = next(p for p in game.players if p.id == player.id)
    return GamePlayerShort.from_player(player)


@router.delete("/{game_id}/players/{user_id}", status_code=204)
async def remove_player(
    user_id: int,
    game: Game = Depends(get_setup_game_for_owner),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    if game.owner_id != user.id:
        raise HTTPException(403, "Только владелец может удалять игроков")
    if user_id == game.owner_id:
        raise HTTPException(400, "Нельзя удалить владельца")

    removed = await game_crud.remove_player(session, game.id, user_id)
    if not removed:
        raise HTTPException(404, "Игрок не найден")
    await session.commit()


@router.post("/{game_id}/start", response_model=GameSchema)
async def start_game(
    game: Game = Depends(get_setup_game_for_owner),
    session: AsyncSession = Depends(get_async_session),
):
    """Подобрать вопросы, привязать, статус ACTIVE."""
    filters = game.filters or {}

    user_ids: set[int] = set()
    if game.owner_id is not None:
        user_ids.add(game.owner_id)
    for p in game.players:
        user_ids.add(p.user_id)

    exclude_ids = await progress_crud.get_passed_question_ids_for_users(
        session, list(user_ids)
    )

    questions = await question_crud.get_random_set(
        session,
        count=game.questions_count,
        author_ids=filters.get("author_ids") or None,
        tournament_ids=filters.get("tournament_ids") or None,
        year_from=filters.get("year_from"),
        year_to=filters.get("year_to"),
        exclude_question_ids=list(exclude_ids) if exclude_ids else None,
        relations=["tournament", "authors"],
    )

    if not questions:
        raise HTTPException(400, "Не найдено вопросов по заданным фильтрам")

    warning = None
    if len(questions) < game.questions_count:
        warning = (
            f"Найдено только {len(questions)} вопросов из {game.questions_count} "
            f"Остальные подходящие вопросы уже пройдены. "
            f"В игре будет только {len(questions)}."
        )
        game.questions_count = len(questions)

    await game_crud.start_game(session, game, [q.id for q in questions])
    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)
    return GameSchema.from_orm_game(game, warning=warning)


@router.post("/{game_id}/answer", response_model=GameSchema)
async def answer_question(
    payload: GameAnswer,
    game: Game = Depends(get_game_for_user),
    session: AsyncSession = Depends(get_async_session),
):
    if game.status != GameStatus.ACTIVE.value:
        raise HTTPException(400, "Игра не активна")

    gq = next((q for q in game.questions if q.question_id == payload.question_id), None)
    if not gq:
        raise HTTPException(404, "Вопрос не найден в игре")
    if gq.is_answered:
        raise HTTPException(400, "Вопрос уже отвечен")

    gq.is_answered = True
    if payload.time_spent_seconds is not None:
        gq.time_spent_seconds = payload.time_spent_seconds
    game.answered_count += 1

    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)
    return GameSchema.from_orm_game(game)


@router.post("/{game_id}/finish", response_model=GameSchema)
async def finish_game(
    game: Game = Depends(get_game_for_owner),
    session: AsyncSession = Depends(get_async_session),
):
    if game.status == GameStatus.FINISHED.value:
        raise HTTPException(400, "Игра уже завершена")
    if game.status != GameStatus.ACTIVE.value:
        raise HTTPException(400, "Игра не была начата")

    await game_crud.finish_game(session, game)

    user_ids: set[int] = set()
    if game.owner_id is not None:
        user_ids.add(game.owner_id)
    for p in game.players:
        user_ids.add(p.user_id)

    question_ids = [gq.question_id for gq in game.questions]

    if user_ids and question_ids:
        await progress_crud.mark_many_as_passed(
            session, list(user_ids), question_ids
        )

    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)
    return GameSchema.from_orm_game(game)


@router.post("/{game_id}/claim", response_model=GameSchema)
async def claim_game(
    payload: GameClaim,
    game_id: int,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(fastapi_users.current_user(active=True)),
):
    """Привязать гостевую игру к авторизованному юзеру."""
    game = await game_crud.get_by_guest_token(session, payload.guest_token)
    if not game or game.id != game_id:
        raise HTTPException(404, "Гостевая игра не найдена")
    if game.owner_id is not None:
        raise HTTPException(400, "У игры уже есть владелец")

    await game_crud.claim_guest_game(session, game, user.id)

    if game.status == GameStatus.FINISHED.value:
        question_ids = [gq.question_id for gq in game.questions]
        if question_ids:
            await progress_crud.mark_many_as_passed(
                session, [user.id], question_ids
            )

    await session.commit()
    game = await game_crud.get_with_relations_or_404(game.id, session)
    return GameSchema.from_orm_game(game)
