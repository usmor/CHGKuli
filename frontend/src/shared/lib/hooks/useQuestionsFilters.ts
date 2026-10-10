import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { parseNumber } from '../utils';

export type QuestionFilters = {
  author_ids: number[];
  tournament_ids: number[];
  year_from: number | null;
  year_to: number | null;
  limit: number;
};

const DEFAULT_FILTERS: QuestionFilters = {
  author_ids: [],
  tournament_ids: [],
  year_from: null,
  year_to: null,
  limit: 20,
};

type UseQuestionFiltersResult = {
  filters: QuestionFilters;
  setFilters: (filters: QuestionFilters) => void;
  resetFilters: () => void;
};

export const useQuestionFilters = (): UseQuestionFiltersResult => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<QuestionFilters>(
    () => ({
      author_ids: searchParams.getAll('author_ids').map(Number).filter(Boolean),
      tournament_ids: searchParams.getAll('tournament_ids').map(Number).filter(Boolean),
      year_from: parseNumber(searchParams.get('year_from')),
      year_to: parseNumber(searchParams.get('year_to')),
      limit: parseNumber(searchParams.get('limit')) ?? DEFAULT_FILTERS.limit,
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (newFilters: QuestionFilters) => {
      const params = new URLSearchParams();
      newFilters.author_ids.forEach((id) => params.append('author_ids', String(id)));
      newFilters.tournament_ids.forEach((id) =>
        params.append('tournament_ids', String(id))
      );

      if (newFilters.year_from) params.set('year_from', String(newFilters.year_from));
      if (newFilters.year_to) params.set('year_to', String(newFilters.year_to));
      if (newFilters.limit !== DEFAULT_FILTERS.limit) {
        params.set('limit', String(newFilters.limit));
      }

      setSearchParams(params);
    },
    [setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { filters, setFilters, resetFilters };
};
