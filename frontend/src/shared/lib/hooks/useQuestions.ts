import { useInfiniteQuery, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { fetcher } from '@/shared/lib/api/fetcher';

import type { QuestionFilters } from './useQuestionsFilters';
import type { Question } from '@/shared/types';

export type QuestionsResponse = {
  items: Question[];
  total: number;
  next_offset: number | null;
  has_more: boolean;
};

const PAGE_SIZE = 20;

export const useQuestions = (
  filters: QuestionFilters
): UseInfiniteQueryResult<{ pages: QuestionsResponse[] }, Error> => {
  return useInfiniteQuery({
    queryKey: ['questions', 'all', filters],
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({
        offset: String(pageParam),
        limit: String(PAGE_SIZE),
        sort: filters.sort,
      });

      filters.author_ids.forEach((id) => params.append('author_ids', String(id)));
      filters.tournament_ids.forEach((id) =>
        params.append('tournament_ids', String(id))
      );

      if (filters.year_from) params.set('year_from', String(filters.year_from));
      if (filters.year_to) params.set('year_to', String(filters.year_to));

      return fetcher<QuestionsResponse>(`/questions?${params.toString()}`);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.next_offset,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
};
