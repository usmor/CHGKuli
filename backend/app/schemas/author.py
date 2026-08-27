from pydantic import BaseModel, Field


class AuthorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255,
                      description="Имя автора")

    class Config:
        extra = 'forbid'


class Author(AuthorBase):
    id: int

    class Config:
        from_attributes = True
