from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, computed_field

from app.schemas.author import Author
from app.schemas.tournament import Tournament


class QuestionBase(BaseModel):
    question_text: str = Field(..., min_length=1, description="Текст вопроса")
    answer: str = Field(..., min_length=1, description="Ответ")
    pass_criteria: Optional[str] = Field(None, description="Критерии зачета")
    comment: Optional[str] = Field(None, description="Комментарий")
    tournament_id: int = Field(..., description="ID турнира")

    class Config:
        extra = 'forbid'


class Question(QuestionBase):
    id: int
    tournament: Optional[Tournament] = None
    authors: List[Author] = []

    @computed_field
    @property
    def author_ids(self) -> List[int]:
        """Получить список ID авторов из authors"""
        return [a.id for a in self.authors]

    class Config:
        from_attributes = True


class QuestionListResponse(BaseModel):
    items: List[Question]
    total: int
    next_offset: Optional[int] = None
    has_more: bool


class QuestionMode(str, Enum):
    QUIZ = "quiz"
    LIST = "list"


class QuestionSetRequest(BaseModel):
    count: int = Field(10, ge=1, le=100,
                       description="Количество вопросов")
    mode: QuestionMode = Field(QuestionMode.QUIZ,
                               description="Режим отображения")
    author_id: Optional[int] = Field(None, description="ID автора")
    tournament_id: Optional[int] = Field(None, description="ID турнира")
    year_from: Optional[int] = Field(None, ge=1800, le=2100,
                                     description="Год от")
    year_to: Optional[int] = Field(None, ge=1800, le=2100,
                                   description="Год до")

    class Config:
        extra = 'forbid'
