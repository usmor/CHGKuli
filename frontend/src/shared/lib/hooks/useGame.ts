import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Game } from '@shared/types/game';

export const useGame = (gameId: number | null): UseQueryResult<Game, Error> => {
  return useQuery<Game, Error>({
    queryKey: ['game', gameId],
    queryFn: () => fetcher<Game>(`/game/${gameId}`),
    enabled: gameId !== null && Number.isFinite(gameId),
    refetchOnWindowFocus: false,
  });
};
