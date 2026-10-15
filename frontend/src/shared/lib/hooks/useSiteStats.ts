import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export type SiteStats = {
  questions: number;
  authors: number;
  tournaments: number;
};

export const useSiteStats = (): UseQueryResult<SiteStats, Error> => {
  return useQuery<SiteStats, Error>({
    queryKey: ['site-stats'],
    queryFn: () => fetcher<SiteStats>('/stats'),
    staleTime: 1000 * 60 * 10,
  });
};
