import { useCreateGame } from '@shared/lib/hooks';

import { GameSetupUI } from './GameSetupUI';

export const GameSetup = (): React.JSX.Element => {
  const create = useCreateGame();

  return (
    <GameSetupUI
      isSubmitting={create.isPending}
      error={create.error?.message ?? null}
      onSubmit={(payload) => create.mutate(payload)}
    />
  );
};
