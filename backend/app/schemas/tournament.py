from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TournamentBase(BaseModel):
    name: str = Field(..., min_length=1)
    date: Optional[datetime] = None

    class Config:
        extra = 'forbid'


class Tournament(TournamentBase):
    id: int
