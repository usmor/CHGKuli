import { useInfiniteQuery, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { fetcher } from '@/shared/lib/api/fetcher';

import type { Question } from '@/shared/types';

export type QuestionsResponse = {
  items: Question[];
  total: number;
  next_offset: number | null;
  has_more: boolean;
};

export const useQuestions = (
  limit = 20
): UseInfiniteQueryResult<{ pages: QuestionsResponse[] }, Error> => {
  return useInfiniteQuery({
    queryKey: ['questions', 'all', limit],
    queryFn: ({ pageParam }) =>
      fetcher<QuestionsResponse>(`/questions?offset=${pageParam}&limit=${limit}`),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.next_offset,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
};
