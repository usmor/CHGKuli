from fastapi import APIRouter

from app.api.endpoints import (
    author_router,
    question_router,
    tournament_router,
    user_router,
)

main_router = APIRouter()
main_router.include_router(author_router, prefix="/authors", tags=["authors"])
main_router.include_router(
    tournament_router, prefix="/tournaments", tags=["tournaments"]
)
main_router.include_router(question_router, prefix="/questions", tags=["questions"])

main_router.include_router(user_router)
