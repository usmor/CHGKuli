import { Accordion, Badge, Group, Stack, Text, Title } from '@mantine/core';
import { CalendarBlankIcon } from '@phosphor-icons/react';
import { formatDateTime, gameStatusColor, gameStatusLabel } from '@shared/lib/utils';

import { GameDetails } from '@/entities';
import { CustomAlert, CustomLoader } from '@/shared/ui';

import type { GameShort } from '@shared/types/game';

// import classes from './ProfileGamesTab.module.css';

type ProfileGamesTabUIProps = {
  games: GameShort[];
  isLoading: boolean;
  isError: boolean;
};

export const ProfileGamesTabUI = ({
  games,
  isLoading,
  isError,
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

  return (
    <Stack gap="lg" w="100%">
      <Title order={3}>История игр</Title>

      <Accordion
        variant="separated"
        radius="md"
        chevronPosition="right"
        chevronIconSize={20}
      >
        {games.map((game) => {
          const total = game.questions_count || 0;
          const answered = game.answered_count || 0;

          return (
            <Accordion.Item key={game.id} value={String(game.id)}>
              <Accordion.Control>
                <Group justify="space-between" wrap="nowrap" gap="md">
                  <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={600} fz={20} truncate>
                      {game.title ?? `Игра #${game.id}`}
                    </Text>
                    <Group gap="xs" c="dimmed" fz={13}>
                      <CalendarBlankIcon size={16} />
                      <Text fz={16} c="dimmed">
                        {formatDateTime(game.started_at ?? game.finished_at)}
                      </Text>
                    </Group>
                  </Stack>

                  <Group gap="xs" wrap="nowrap" mr={10}>
                    <Badge
                      variant="light"
                      color="var(--purple-haze)"
                      size="lg"
                      styles={{ label: { fontSize: 16 } }}
                      radius="md"
                    >
                      {answered} / {total}
                    </Badge>
                    <Badge
                      color={gameStatusColor(game.status)}
                      size="lg"
                      radius="md"
                      styles={{ label: { fontSize: 16 } }}
                    >
                      {gameStatusLabel(game.status)}
                    </Badge>
                  </Group>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <GameDetails gameId={game.id} />
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Stack>
  );
};
