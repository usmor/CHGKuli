from datetime import datetime

from fastapi_users import schemas
from pydantic import BaseModel, Field


class UserRead(schemas.BaseUser[int]):
    username: str


class UserCreate(schemas.BaseUserCreate):
    username: str


class UserUpdate(schemas.BaseUserUpdate):
    username: str | None = None


class DailyCodeResponse(BaseModel):
    daily_code: str


class UserStats(BaseModel):
    questions_passed: int
    games_played: int
    registered_at: datetime
    days_since_registration: int
    total_time_seconds: int


class PasswordUpdate(BaseModel):
    current_password: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)
