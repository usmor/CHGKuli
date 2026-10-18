import { useAuth, useClaimGame, useGame } from '@shared/lib/hooks';
import { useGameStore } from '@shared/lib/store';
import { useEffect } from 'react';

import { CustomAlert, CustomLoader } from '@/shared/ui';

import { GamePageUI } from './GameUI';

type GameLoaderProps = { gameId: number };

export const GameLoader = ({ gameId }: GameLoaderProps): React.JSX.Element => {
  const { user } = useAuth();
  const { guestToken, currentGameId } = useGameStore();
  const { data: game, isLoading, isError } = useGame(gameId);
  const claim = useClaimGame(gameId);

  useEffect(() => {
    const shouldClaim =
      user !== null &&
      guestToken !== null &&
      currentGameId === gameId &&
      game?.owner_id === null &&
      !claim.isPending &&
      !claim.isSuccess;

    if (shouldClaim) {
      claim.mutate();
    }
  }, [user, guestToken, currentGameId, game?.owner_id, gameId]);

  if (isLoading) {
    return <CustomLoader />;
  }

  if (isError || !game) {
    return (
      <CustomAlert
        title="Игра не найдена"
        message="Возможно, она удалена или у вас нет к ней доступа."
      />
    );
  }

  return <GamePageUI game={game} />;
};
