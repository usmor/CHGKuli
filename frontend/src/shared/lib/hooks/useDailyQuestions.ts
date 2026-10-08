import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Question } from '@/shared/types';

export const useDailyQuestions = (count = 10): UseQueryResult<Question[], Error> => {
  return useQuery<Question[], Error>({
    queryKey: ['questions', 'daily', count],
    queryFn: () => fetcher<Question[]>(`/questions/daily?count=${count}`),
    staleTime: 1000 * 60 * 60,
  });
};
