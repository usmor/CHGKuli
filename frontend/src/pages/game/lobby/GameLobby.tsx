import { ApiError } from '@shared/lib/api/fetcher';
import { useAuth, useAvailableQuestions, useGameActions } from '@shared/lib/hooks';
import { useState } from 'react';

import { StartWarningModal } from '@/widgets';

import { GameLobbyUI } from './GameLobbyUI';

import type { Game } from '@shared/types/game';

type GameLobbyProps = { game: Game };

export const GameLobby = ({ game }: GameLobbyProps): React.JSX.Element => {
  const { user } = useAuth();
  const { start, removePlayer } = useGameActions(game.id);
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningData, setWarningData] = useState<{
    available: number;
    requested: number;
  } | null>(null);

  const availableQuery = useAvailableQuestions(game.id, false);

  const isOwner = user ? game.owner_id === user.id : false;
  const isGuestOwner = game.owner_id === null;
  const isOwnerOrGuest = isOwner || isGuestOwner;

  const handleStart = async (): Promise<void> => {
    const result = await availableQuery.refetch();
    const data = result.data;

    if (data && data.available < data.requested) {
      setWarningData(data);
      setWarningOpen(true);
      return;
    }

    start.mutate();
  };

  const handleConfirmStart = (): void => {
    setWarningOpen(false);
    start.mutate();
  };

  const startErrorMessage =
    start.error instanceof ApiError
      ? (start.error.detail ?? start.error.message)
      : (start.error?.message ?? null);

  return (
    <>
      <GameLobbyUI
        game={game}
        isOwner={isOwner}
        isOwnerOrGuest={isOwnerOrGuest}
        isStarting={start.isPending || availableQuery.isFetching}
        startError={startErrorMessage}
        onStart={() => void handleStart()}
        onRemovePlayer={(userId) => removePlayer.mutate(userId)}
        isRemovingPlayer={removePlayer.isPending}
      />
      <StartWarningModal
        opened={warningOpen}
        onClose={() => setWarningOpen(false)}
        onConfirm={handleConfirmStart}
        available={warningData?.available ?? 0}
        requested={warningData?.requested ?? 0}
      />
    </>
  );
};
