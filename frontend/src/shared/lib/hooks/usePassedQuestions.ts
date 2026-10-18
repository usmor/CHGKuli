import { fetcher } from '@shared/lib/api/fetcher';
import { useInfiniteQuery, type UseInfiniteQueryResult } from '@tanstack/react-query';

import { useAuth } from './useAuth';

import type { QuestionFilters } from './useQuestionsFilters';
import type { Question } from '@shared/types';

export type PassedQuestionsPage = {
  items: Question[];
  total: number;
  next_offset: number | null;
  has_more: boolean;
};

const LIMIT = 20;

export const usePassedQuestions = (
  filters: QuestionFilters
): UseInfiniteQueryResult<{ pages: PassedQuestionsPage[] }, Error> => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ['passed-questions', filters],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const search = new URLSearchParams();
      search.set('offset', String(pageParam));
      search.set('limit', String(LIMIT));
      search.set('sort', filters.sort);
      filters.author_ids.forEach((id) => search.append('author_ids', String(id)));
      filters.tournament_ids.forEach((id) =>
        search.append('tournament_ids', String(id))
      );
      if (filters.year_from) search.set('year_from', String(filters.year_from));
      if (filters.year_to) search.set('year_to', String(filters.year_to));

      return fetcher<PassedQuestionsPage>(
        `/progress/passed/questions?${search.toString()}`
      );
    },
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_offset : undefined,
    enabled: Boolean(user),
  });
};
