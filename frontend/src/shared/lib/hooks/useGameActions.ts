import { fetcher } from '@shared/lib/api/fetcher';
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import type { Game, GamePlayerShort } from '@shared/types/game';

type AnswerPayload = {
  question_id: number;
  time_spent_seconds?: number;
};

type AddPlayerPayload = {
  username: string;
  daily_code: string;
};

type GameActions = {
  start: UseMutationResult<Game, Error, void>;
  answer: UseMutationResult<Game, Error, AnswerPayload>;
  finish: UseMutationResult<Game, Error, void>;
  claim: UseMutationResult<Game, Error, string>;
  addPlayer: UseMutationResult<GamePlayerShort, Error, AddPlayerPayload>;
  removePlayer: UseMutationResult<void, Error, number>;
  markSeen: UseMutationResult<Game, Error, AnswerPayload>;
};

export const useGameActions = (gameId: number): GameActions => {
  const queryClient = useQueryClient();

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: ['game', gameId] });
  };

  const start = useMutation<Game, Error, void>({
    mutationFn: () => fetcher<Game>(`/game/${gameId}/start`, { method: 'POST' }),
    onSuccess: (data) => {
      queryClient.setQueryData(['game', gameId], data);
    },
  });

  const answer = useMutation<Game, Error, AnswerPayload>({
    mutationFn: (payload) =>
      fetcher<Game>(`/game/${gameId}/answer`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: invalidate,
  });

  const finish = useMutation<Game, Error, void>({
    mutationFn: () => fetcher<Game>(`/game/${gameId}/finish`, { method: 'POST' }),
    onSuccess: invalidate,
  });

  const claim = useMutation<Game, Error, string>({
    mutationFn: (guestToken) =>
      fetcher<Game>(`/game/${gameId}/claim`, {
        method: 'POST',
        body: JSON.stringify({ guest_token: guestToken }),
      }),
    onSuccess: invalidate,
  });

  const addPlayer = useMutation<GamePlayerShort, Error, AddPlayerPayload>({
    mutationFn: (payload) =>
      fetcher<GamePlayerShort>(`/game/${gameId}/players`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: invalidate,
  });

  const removePlayer = useMutation<void, Error, number>({
    mutationFn: (userId) =>
      fetcher<void>(`/game/${gameId}/players/${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: invalidate,
  });

  const markSeen = useMutation<Game, Error, AnswerPayload>({
    mutationFn: (payload: AnswerPayload) =>
      fetcher<Game>(`/game/${gameId}/seen`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: invalidate,
  });

  return { start, answer, finish, claim, addPlayer, removePlayer, markSeen };
};
