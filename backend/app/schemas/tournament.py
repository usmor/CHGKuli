from typing import Optional

from pydantic import BaseModel, Field


class TournamentBase(BaseModel):
    name: str = Field(..., min_length=1,
                      description="Название турнира")
    year: Optional[int] = Field(None, ge=1800, le=2100,
                                description="Год проведения")

    class Config:
        extra = 'forbid'


class Tournament(TournamentBase):
    id: int

    class Config:
        from_attributes = True 
