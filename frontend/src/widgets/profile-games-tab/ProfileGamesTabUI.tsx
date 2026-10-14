import { Accordion, Stack, Switch } from '@mantine/core';

import { GameAccordionItem } from '@/entities/game-accordion-item';
import { CustomAlert, CustomLoader } from '@/shared/ui';

import type { GameShort } from '@shared/types/game';

type ProfileGamesTabUIProps = {
  games: GameShort[];
  isLoading: boolean;
  isError: boolean;
  showHidden: boolean;
  onShowHiddenChange: (value: boolean) => void;
};

export const ProfileGamesTabUI = ({
  games,
  isLoading,
  isError,
  showHidden,
  onShowHiddenChange,
}: ProfileGamesTabUIProps): React.JSX.Element => {
  if (isLoading) {
    return (
      <Stack align="center" py="xl">
        <CustomLoader />
      </Stack>
    );
  }

  if (isError) {
    return (
      <CustomAlert
        title="Не удалось загрузить историю"
        message="Попробуйте обновить страницу."
      />
    );
  }

  if (games.length === 0) {
    return (
      <CustomAlert
        title="Игр пока нет"
        message="Создайте первую игру — и она появится здесь."
      />
    );
  }

  const visible = games.filter((g) => !g.is_hidden);
  const hidden = games.filter((g) => g.is_hidden);
  const list = showHidden ? [...visible, ...hidden] : visible;

  return (
    <Stack gap="lg" w="100%">
      <Switch
        radius="md"
        checked={showHidden}
        onChange={(e) => onShowHiddenChange(e.currentTarget.checked)}
        label={`Показывать скрытые${hidden.length > 0 ? ` (${hidden.length})` : ''}`}
        styles={{
          label: {
            fontSize: 18,
            fontWeight: 500,
          },
          track: {
            backgroundColor: 'var(--purple-haze)',
            borderColor: 'var(--purple-haze)',
          },
        }}
      />
      {list.length > 0 && (
        <Accordion
          variant="separated"
          radius="md"
          chevronPosition="right"
          chevronIconSize={20}
        >
          {list.map((game) => (
            <GameAccordionItem key={game.id} game={game} />
          ))}
        </Accordion>
      )}
    </Stack>
  );
};
