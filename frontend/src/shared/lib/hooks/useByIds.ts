import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetcher } from '../api';

import type { AutoCompleteType, SearchItem } from '@shared/types';

export const useByIds = (
  type: AutoCompleteType,
  ids: number[]
): UseQueryResult<SearchItem[], Error> => {
  return useQuery<SearchItem[], Error>({
    queryKey: ['by-ids', type, ids],
    queryFn: () => {
      const params = new URLSearchParams();
      ids.forEach((id) => params.append('ids', String(id)));
      return fetcher<SearchItem[]>(`/${type}/autocomplete?${params.toString()}`);
    },
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });
};
