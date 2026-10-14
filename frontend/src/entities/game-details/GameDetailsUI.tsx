import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { PlayIcon } from '@phosphor-icons/react';

import { CustomAlert } from '@/shared/ui';

import type { Game } from '@/shared/types/game';

type GameDetailsUIProps = {
  game: Game;
};

export const GameDetailsUI = ({ game }: GameDetailsUIProps): React.JSX.Element => {
  const canContinue = game.status === 'active';
  const showQuestions = game.status === 'finished';
  return (
    <Stack gap="md">
      <div>
        <Text fw={600} fz={18} mb={6}>
          Состав команды
        </Text>
        <Group gap="xs">
          {game.players.length === 0 ? (
            <Text size="m" c="dimmed">
              Без игроков
            </Text>
          ) : (
            game.players.map((p) => (
              <Badge key={p.id} color="var(--easter-purple)" radius="md" size="lg">
                {p.username}
              </Badge>
            ))
          )}
        </Group>
      </div>

      {showQuestions && (
        <div>
          <Text fw={600} fz={18} mb={6}>
            Вопросы
          </Text>
          <Stack gap="xs">
            {game.questions.length === 0 ? (
              <Text size="m" c="dimmed">
                Вопросов нет
              </Text>
            ) : (
              game.questions.map((gq) => (
                <Card key={gq.id} withBorder padding="sm" radius="sm">
                  <Group justify="space-between" wrap="nowrap" align="flex-start">
                    <Text size="s" style={{ flex: 1 }}>
                      <Text span fw={600} mr={6}>
                        {gq.order}.
                      </Text>
                      {gq.question.question_text}
                    </Text>
                    <Badge
                      radius="md"
                      color={
                        gq.is_answered ? 'var(--crocus-purple)' : 'var(--purple-haze)'
                      }
                      variant={gq.is_answered ? 'filled' : 'light'}
                      style={{ flexShrink: 0 }}
                    >
                      {gq.is_answered ? '✓' : '—'}
                    </Badge>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </div>
      )}
      {canContinue && (
        <CustomAlert
          title="Игра ещё идёт"
          message="Вопросы появятся здесь после завершения игры."
        />
      )}
      <Group justify="flex-end" mt="sm">
        <Button
          variant="light"
          color="var(--soft-blue)"
          size="md"
          radius="md"
          leftSection={<PlayIcon size={16} />}
          disabled
        >
          {canContinue ? 'Продолжить игру' : 'Открыть игру'}
        </Button>
      </Group>
    </Stack>
  );
};
