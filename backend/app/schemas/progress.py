from pydantic import BaseModel


class QuestionProgress(BaseModel):
    question_id: int
    is_passed: bool


class UserProgressList(BaseModel):
    question_ids: list[int]
    total: int
