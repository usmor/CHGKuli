import { CustomAlert } from '@/shared/ui';

import { GameFinish } from './finish';
import { GameLobby } from './lobby';
import { GamePlay } from './play';

import type { Game } from '@shared/types/game';

type GamePageUIProps = { game: Game };

export const GamePageUI = ({ game }: GamePageUIProps): React.JSX.Element => {
  switch (game.status) {
    case 'setup':
      return <GameLobby game={game} />;
    case 'active':
      return <GamePlay game={game} />;
    case 'finished':
      return <GameFinish game={game} />;
    default:
      return (
        <CustomAlert
          title="Неизвестная ошибка."
          message="Попробуйте перезагрузить страницу позже."
        />
      );
  }
};
