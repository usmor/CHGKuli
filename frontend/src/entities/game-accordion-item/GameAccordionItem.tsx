import { Accordion, Badge, Group, Stack, Text } from '@mantine/core';
import { CalendarBlankIcon } from '@phosphor-icons/react';
import { formatDateTime, gameStatusColor, gameStatusLabel } from '@shared/lib/utils';

import { GameDetails } from '../game-details';

import type { GameShort } from '@shared/types/game';

export const GameAccordionItem = ({ game }: { game: GameShort }): React.JSX.Element => {
  const answered = game.answered_count ?? 0;
  const total = game.questions_count ?? 0;

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
            {game.is_hidden && (
              <Badge
                radius="md"
                size="lg"
                color="var(--purple-haze)"
                styles={{ label: { fontSize: 16 } }}
              >
                Скрыто
              </Badge>
            )}
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
        <GameDetails gameId={game.id} isHidden={game.is_hidden} />
      </Accordion.Panel>
    </Accordion.Item>
  );
};
