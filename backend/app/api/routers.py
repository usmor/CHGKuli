from fastapi import APIRouter


from app.api.endpoints import (author_router,
                               tournament_router,
                               question_router)

main_router = APIRouter()
main_router.include_router(author_router, prefix='/author',
                           tags=['authors'])
main_router.include_router(tournament_router, prefix='/tournament',
                           tags=['tournaments'])
main_router.include_router(question_router, prefix='/question',
                           tags=['questions'])
