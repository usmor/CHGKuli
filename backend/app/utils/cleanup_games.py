import asyncio
import sys

from app.core.db import AsyncSessionLocal
from app.crud.game import game_crud


async def cleanup(older_than_hours: int = 24) -> int:
    async with AsyncSessionLocal() as session:
        return await game_crud.delete_stale_guest_games(
            session, older_than_hours=older_than_hours
        )


if __name__ == "__main__":
    hours = int(sys.argv[1]) if len(sys.argv) > 1 else 24
    deleted = asyncio.run(cleanup(hours))
    print(
        f"Удалено {deleted} устаревших игр неавторизованных гостей (старше {hours} ч.)"
    )
