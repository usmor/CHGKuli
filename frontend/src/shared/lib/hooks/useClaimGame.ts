import { fetcher } from '@shared/lib/api/fetcher';
import { useGameStore } from '@shared/lib/store';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { Game } from '@shared/types/game';

export const useClaimGame = (gameId: number): UseMutationResult<Game, Error, void> => {
  const queryClient = useQueryClient();
  const { guestToken, setGuestToken, setCurrentGameId } = useGameStore();

  return useMutation<Game, Error, void>({
    mutationFn: () =>
      fetcher<Game>(`/game/${gameId}/claim`, {
        method: 'POST',
        body: JSON.stringify({ guest_token: guestToken }),
      }),
    onSuccess: () => {
      setGuestToken(null);
      setCurrentGameId(null);
      void queryClient.invalidateQueries({ queryKey: ['game', gameId] });
      void queryClient.invalidateQueries({ queryKey: ['my-games'] });
    },
  });
};
