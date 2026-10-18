from pydantic import BaseModel


class SiteStats(BaseModel):
    questions: int
    authors: int
    tournaments: int
