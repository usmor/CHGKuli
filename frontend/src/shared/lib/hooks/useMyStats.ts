import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { useAuth } from './useAuth';

import type { UserStats } from '@shared/types/user';

export const useMyStats = (): UseQueryResult<UserStats, Error> => {
  const { user } = useAuth();

  return useQuery<UserStats, Error>({
    queryKey: ['my-stats'],
    queryFn: () => fetcher<UserStats>('/users/me/stats'),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 5,
  });
};
