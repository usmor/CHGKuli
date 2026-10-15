import { fetcher } from '@shared/lib/api/fetcher';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

type AvailableQuestionsResponse = {
  available: number;
  requested: number;
};

export const useAvailableQuestions = (
  gameId: number,
  enabled: boolean
): UseQueryResult<AvailableQuestionsResponse, Error> => {
  return useQuery<AvailableQuestionsResponse, Error>({
    queryKey: ['available-questions', gameId],
    queryFn: () =>
      fetcher<AvailableQuestionsResponse>(`/game/${gameId}/available-questions`),
    enabled,
    staleTime: 0,
  });
};
