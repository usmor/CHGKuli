import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { Question } from '@shared/types';

export const useQuestion = (id: number): UseQueryResult<Question, Error> => {
  return useQuery<Question, Error>({
    queryKey: ['question', id],
    queryFn: () => fetcher<Question>(`/questions/${id}`),
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled: Boolean(id),
  });
};
