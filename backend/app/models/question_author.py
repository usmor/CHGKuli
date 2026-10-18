from sqlalchemy import Column, ForeignKey, Integer, Table

from app.core.db import Base

question_author_association = Table(
    "question_author_association",
    Base.metadata,
    Column(
        "question_id",
        Integer,
        ForeignKey("question.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "author_id",
        Integer,
        ForeignKey("author.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
