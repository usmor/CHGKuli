import { useGame } from '@shared/lib/hooks';
import { CustomAlert, CustomLoader } from '@shared/ui';

import { GameDetailsUI } from './GameDetailsUI';

export const GameDetails = ({ gameId }: { gameId: number }): React.JSX.Element => {
  const { data: game, isLoading, isError } = useGame(gameId);

  if (isLoading) return <CustomLoader />;
  if (isError || !game)
    return <CustomAlert title="Не удалось загрузить игру" message="Попробуйте позже." />;

  return <GameDetailsUI game={game} />;
};
