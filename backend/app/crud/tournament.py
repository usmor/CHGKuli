from app.crud.base import CRUDBase
from app.models.question import Tournament


class CRUDTournament(CRUDBase):
    pass


tournament_crud = CRUDTournament(Tournament)
