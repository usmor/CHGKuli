from enum import Enum

from pydantic import BaseModel, Field, computed_field

from app.schemas.author import Author
from app.schemas.tournament import Tournament


class QuestionSort(str, Enum):
    RANDOM = "random"
    YEAR_DESC = "year_desc"
    YEAR_ASC = "year_asc"
    AUTHOR = "author"
    TOURNAMENT = "tournament"


class QuestionBase(BaseModel):
    question_text: str = Field(..., min_length=1, description="Текст вопроса")
    answer: str = Field(..., min_length=1, description="Ответ")
    pass_criteria: str | None = Field(None, description="Критерии зачета")
    comment: str | None = Field(None, description="Комментарий")
    tournament_id: int = Field(..., description="ID турнира")

    class Config:
        extra = "forbid"


class Question(QuestionBase):
    id: int
    tournament: Tournament | None = None
    authors: list[Author] = []

    @computed_field  # type: ignore[prop-decorator]
    @property
    def author_ids(self) -> list[int]:
        """Получить список ID авторов из authors"""
        return [a.id for a in self.authors]

    class Config:
        from_attributes = True


class QuestionListResponse(BaseModel):
    items: list[Question]
    total: int
    next_offset: int | None = None
    has_more: bool


class QuestionSetRequest(BaseModel):
    count: int = Field(10, ge=1, le=100, description="Количество вопросов")
    author_ids: list[int] = Field(default_factory=list, description="ID авторов")
    tournament_ids: list[int] = Field(default_factory=list, description="ID турниров")
    year_from: int | None = Field(None, ge=1800, le=2100, description="Год от")
    year_to: int | None = Field(None, ge=1800, le=2100, description="Год до")

    class Config:
        extra = "forbid"
