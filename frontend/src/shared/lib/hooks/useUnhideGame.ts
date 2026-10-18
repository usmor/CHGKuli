import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import { fetcher } from '../api';

export const useUnhideGame = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (gameId: number) =>
      fetcher<void>(`/game/${gameId}/hide`, { method: 'DELETE' }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-games'] });
    },
  });
};
