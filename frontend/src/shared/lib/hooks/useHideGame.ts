import { fetcher } from '@shared/lib/api/fetcher';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

export const useHideGame = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (gameId: number) =>
      fetcher<void>(`/game/${gameId}/hide`, { method: 'POST' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-games'] });
    },
  });
};
