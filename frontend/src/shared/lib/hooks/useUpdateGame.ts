import { fetcher } from '@shared/lib/api/fetcher';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { Game, GameFilters } from '@shared/types/game';

type UpdatePayload = {
  title?: string;
  questions_count?: number;
  has_timer?: boolean;
  time_per_question?: number;
  filters?: GameFilters;
};

export const useUpdateGame = (
  gameId: number
): UseMutationResult<Game, Error, UpdatePayload> => {
  const queryClient = useQueryClient();

  return useMutation<Game, Error, UpdatePayload>({
    mutationFn: (payload: UpdatePayload) =>
      fetcher<Game>(`/game/${gameId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['game', gameId] });
    },
  });
};
