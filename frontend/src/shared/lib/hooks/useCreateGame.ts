import { fetcher } from '@shared/lib/api/fetcher';
import { useGameStore } from '@shared/lib/store';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { GameFilters, GameWithToken } from '@shared/types/game';

type CreateGamePayload = {
  title?: string;
  questions_count: number;
  has_timer: boolean;
  time_per_question?: number;
  filters?: GameFilters;
};

export const useCreateGame = (): UseMutationResult<
  GameWithToken,
  Error,
  CreateGamePayload
> => {
  const navigate = useNavigate();
  const { setGuestToken, setCurrentGameId } = useGameStore();

  return useMutation<GameWithToken, Error, CreateGamePayload>({
    mutationFn: (payload: CreateGamePayload) =>
      fetcher<GameWithToken>('/game', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      if (data.guest_token) {
        setGuestToken(data.guest_token);
      }
      setCurrentGameId(data.game.id);
      void navigate(`/game/${data.game.id}`);
    },
  });
};
