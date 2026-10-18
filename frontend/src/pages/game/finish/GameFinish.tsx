import { ApiError } from '@shared/lib/api/fetcher';
import { useAuth, useClaimGame } from '@shared/lib/hooks';

import { GameFinishUI } from './GameFinishUI';

import type { Game } from '@shared/types';

type Props = { game: Game };

export const GameFinish = ({ game }: Props): React.JSX.Element => {
  const { user } = useAuth();
  const claim = useClaimGame(game.id);

  const claimError =
    claim.error instanceof ApiError
      ? (claim.error.detail ?? claim.error.message)
      : (claim.error?.message ?? null);

  return (
    <GameFinishUI
      game={game}
      isAuthorized={Boolean(user)}
      isClaiming={claim.isPending}
      claimError={claimError}
    />
  );
};
