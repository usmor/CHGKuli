import { useDisclosure } from '@mantine/hooks';
import { useGame, useHideGame, useUnhideGame } from '@shared/lib/hooks';
import { CustomAlert, CustomLoader } from '@shared/ui';

import { GameDetailsUI } from './GameDetailsUI';

type GameDetailsProps = {
  gameId: number;
  isHidden: boolean;
};

export const GameDetails = ({
  gameId,
  isHidden,
}: GameDetailsProps): React.JSX.Element => {
  const { data: game, isLoading, isError } = useGame(gameId);
  const hideGame = useHideGame();
  const unhideGame = useUnhideGame();
  const [opened, { open, close }] = useDisclosure(false);

  if (isLoading) return <CustomLoader />;
  if (isError || !game)
    return <CustomAlert title="Не удалось загрузить игру" message="Попробуйте позже." />;

  return (
    <GameDetailsUI
      game={game}
      isHidden={isHidden}
      onHide={() => hideGame.mutate(gameId, { onSuccess: close })}
      onUnhide={() => unhideGame.mutate(gameId)}
      hideLoading={hideGame.isPending}
      unhideLoading={unhideGame.isPending}
      opened={opened}
      onOpen={open}
      onClose={close}
    />
  );
};
