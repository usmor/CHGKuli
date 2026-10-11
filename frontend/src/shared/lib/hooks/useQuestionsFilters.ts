import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { parseNumber, parseSort } from '../utils';

export type QuestionSort = 'random' | 'year_desc' | 'year_asc' | 'author' | 'tournament';

export type QuestionFilters = {
  author_ids: number[];
  tournament_ids: number[];
  year_from: number | null;
  year_to: number | null;
  sort: QuestionSort;
};

const DEFAULT_FILTERS: QuestionFilters = {
  author_ids: [],
  tournament_ids: [],
  year_from: null,
  year_to: null,
  sort: 'random',
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
      sort: parseSort(searchParams.get('sort')),
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
      if (newFilters.sort !== DEFAULT_FILTERS.sort) {
        params.set('sort', newFilters.sort);
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
