import { useAuth, useGameActions } from '@shared/lib/hooks';

import { GameLobbyUI } from './GameLobbyUI';

import type { Game } from '@shared/types/game';

type GameLobbyProps = { game: Game };

export const GameLobby = ({ game }: GameLobbyProps): React.JSX.Element => {
  const { user } = useAuth();
  const { start, removePlayer } = useGameActions(game.id);

  // авторизованный владелец
  const isOwner = user ? game.owner_id === user.id : false;
  // гость, создавший игру
  const isGuestOwner = game.owner_id === null;
  const isOwnerOrGuest = isOwner || isGuestOwner;

  const handleStart = (): void => {
    start.mutate();
  };

  return (
    <GameLobbyUI
      game={game}
      isOwner={isOwner}
      isOwnerOrGuest={isOwnerOrGuest}
      isStarting={start.isPending}
      startError={start.error?.message ?? null}
      onStart={handleStart}
      onRemovePlayer={(userId) => removePlayer.mutate(userId)}
      isRemovingPlayer={removePlayer.isPending}
    />
  );
};
