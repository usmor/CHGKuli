import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetcher } from '../api';

import type { AutoCompleteType, SearchItem } from '@shared/types';

export const useAutoComplete = (
  type: AutoCompleteType,
  query: string
): UseQueryResult<SearchItem[], Error> => {
  return useQuery<SearchItem[], Error>({
    queryKey: ['autocomplete', type, query],
    queryFn: () =>
      fetcher<SearchItem[]>(
        `/${type}/autocomplete?q=${encodeURIComponent(query)}&limit=10`
      ),
    enabled: query.length === 0 || query.length >= 2,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
};
