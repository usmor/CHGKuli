import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { useAuth } from './useAuth';

export type DailyCodeResponse = {
  daily_code: string;
};

export const useDailyCode = (): UseQueryResult<DailyCodeResponse> => {
  const { user } = useAuth();

  return useQuery<DailyCodeResponse>({
    queryKey: ['daily-code'],
    queryFn: () => fetcher<DailyCodeResponse>('/users/me/daily-code'),
    enabled: Boolean(user),
    staleTime: 1000 * 60 * 60,
  });
};
