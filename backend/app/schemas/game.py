from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, computed_field, field_validator

from app.schemas.question import Question


class GameFilters(BaseModel):
    author_ids: List[int] = Field(default_factory=list)
    tournament_ids: List[int] = Field(default_factory=list)
    year_from: Optional[int] = Field(None, ge=1800, le=2100)
    year_to: Optional[int] = Field(None, ge=1800, le=2100)

    @field_validator("year_to")
    @classmethod
    def validate_years(cls, v, info):
        year_from = info.data.get("year_from")
        if v is not None and year_from is not None and v < year_from:
            raise ValueError("Год «по» не может быть меньше года «с»")
        return v


class GameCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    questions_count: int = Field(10, ge=1, le=100)
    has_timer: bool = False
    time_per_question: Optional[int] = Field(None, ge=5, le=300)
    filters: Optional[GameFilters] = None

    @field_validator("time_per_question")
    @classmethod
    def validate_timer(cls, v, info):
        has_timer = info.data.get("has_timer")
        if has_timer and v is None:
            raise ValueError("Укажите время на вопрос, если включён таймер")
        return v


class GameSettingsUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    questions_count: Optional[int] = Field(None, ge=1, le=100)
    has_timer: Optional[bool] = None
    time_per_question: Optional[int] = Field(None, ge=5, le=300)
    filters: Optional[GameFilters] = None


class GamePlayerAdd(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    daily_code: str = Field(..., min_length=6, max_length=6)

    @field_validator("daily_code")
    @classmethod
    def validate_code(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("Код должен состоять из цифр")
        return v


class GamePlayerShort(BaseModel):
    id: int
    user_id: int
    username: str

    class Config:
        from_attributes = True

    @classmethod
    def from_player(cls, player) -> "GamePlayerShort":
        return cls(
            id=player.id,
            user_id=player.user_id,
            username=player.user.username if player.user else "",
        )


class GameQuestionItem(BaseModel):
    id: int
    order: int
    is_answered: bool
    time_spent_seconds: Optional[int] = None
    question: "Question"

    class Config:
        from_attributes = True


class GameShort(BaseModel):
    id: int
    title: Optional[str]
    status: str
    questions_count: int
    answered_count: int
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    is_hidden: bool = False 

    @computed_field  # type: ignore[prop-decorator]
    @property
    def is_finished(self) -> bool:
        return self.status == "finished"

    class Config:
        from_attributes = True


class Game(BaseModel):
    id: int
    owner_id: Optional[int]
    title: Optional[str]
    status: str
    has_timer: bool
    time_per_question: Optional[int]
    questions_count: int
    filters: Optional[dict]
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    answered_count: int
    players: List[GamePlayerShort] = []
    questions: List[GameQuestionItem] = []
    warning: Optional[str] = None

    @computed_field  # type: ignore[prop-decorator]
    @property
    def is_finished(self) -> bool:
        return self.status == "finished"

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_game(cls, game,  warning: str | None = None) -> "Game":
        return cls(
            id=game.id,
            owner_id=game.owner_id,
            title=game.title,
            status=game.status,
            has_timer=game.has_timer,
            time_per_question=game.time_per_question,
            questions_count=game.questions_count,
            filters=game.filters,
            started_at=game.started_at,
            finished_at=game.finished_at,
            answered_count=game.answered_count,
            players=[GamePlayerShort.from_player(p) for p in game.players],
            questions=game.questions,
            warning=warning
        )


class GameWithToken(BaseModel):
    game: Game
    guest_token: Optional[str] = None


class GameAnswer(BaseModel):
    question_id: int
    time_spent_seconds: Optional[int] = Field(None, ge=0)


class GameClaim(BaseModel):
    guest_token: str
