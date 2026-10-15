import { useParams } from 'react-router-dom';

import { Seo } from '@/shared/ui';

import { GameLoader } from './GameLoader';
import { GameSetup } from './setup';

export const Game = (): React.JSX.Element => {
  const { gameId: gameIdParam } = useParams<{ gameId?: string }>();
  const gameId = gameIdParam ? Number(gameIdParam) : null;

  if (gameId === null) {
    return <GameSetup />;
  }

  if (!Number.isFinite(gameId)) {
    return <div>Некорректный id игры</div>;
  }

  return (
    <>
      <Seo title="Игра" noIndex />
      <GameLoader gameId={gameId} />;
    </>
  );
};
