import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { useAuth } from './useAuth';

import type { GameShort } from '@shared/types/game';

export const useMyGames = (limit = 50): UseQueryResult<GameShort[], Error> => {
  const { user } = useAuth();

  return useQuery<GameShort[], Error>({
    queryKey: ['my-games', limit],
    queryFn: () => fetcher<GameShort[]>(`/game/my?limit=${limit}&offset=0`),
    enabled: Boolean(user),
  });
};
