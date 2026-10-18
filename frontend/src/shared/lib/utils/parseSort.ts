import type { QuestionSort } from '../hooks/useQuestionsFilters';

export function parseSort(value: string | null): QuestionSort {
  if (
    value === 'year_desc' ||
    value === 'year_asc' ||
    value === 'author' ||
    value === 'tournament'
  ) {
    return value;
  }
  return 'random';
}
