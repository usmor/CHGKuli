from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.author import Author
from app.schemas.tournament import Tournament


class QuestionBase(BaseModel):
    question_text: str = Field(..., min_length=1, description="Текст вопроса")
    answer: str = Field(..., min_length=1, description="Ответ")
    pass_criteria: Optional[str] = Field(None, description="Критерии зачета")
    comment: Optional[str] = Field(None, description="Комментарий")
    tournament_id: int = Field(..., description="ID турнира")
    author_ids: List[int] = Field(..., description="ID авторов")

    class Config:
        extra = 'forbid'


class Question(QuestionBase):
    id: int
    tournament: Optional[Tournament] = None
    authors: List[Author] = []


class QuestionListResponse(BaseModel):
    items: List[Question]
    total: int
    next_offset: Optional[int] = None
    has_more: bool


class QuestionMode(str, Enum):
    QUIZ = "quiz"
    LIST = "list"


class QuestionSetRequest(BaseModel):
    count: int = 10
    mode: QuestionMode = QuestionMode.QUIZ

    author_id: Optional[int] = None
    tournament_id: Optional[int] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
