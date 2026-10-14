import { Badge, Button, Card, Group, Modal, Stack, Text } from '@mantine/core';
import { EyeIcon, EyeSlashIcon, PlayIcon } from '@phosphor-icons/react';

import { CustomAlert } from '@/shared/ui';

import type { Game } from '@/shared/types/game';

type GameDetailsUIProps = {
  game: Game;
  isHidden: boolean;
  onHide: () => void;
  onUnhide: () => void;
  hideLoading: boolean;
  unhideLoading: boolean;
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const GameDetailsUI = ({
  game,
  isHidden,
  onHide,
  onUnhide,
  hideLoading,
  unhideLoading,
  opened,
  onOpen,
  onClose,
}: GameDetailsUIProps): React.JSX.Element => {
  const canContinue = game.status === 'active';
  const showQuestions = game.status === 'finished';
  if (isHidden) {
    return (
      <Stack gap="md" align="center" py="md">
        <Text c="dimmed" ta="center">
          Игра скрыта из основного списка.
          <br />
          Верните её, чтобы посмотреть детали или продолжить.
        </Text>
        <Button
          variant="light"
          color="var(--crocus-purple)"
          size="md"
          radius="md"
          leftSection={<EyeIcon size={16} />}
          loading={unhideLoading}
          onClick={onUnhide}
        >
          Вернуть в список
        </Button>
      </Stack>
    );
  }
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
        {isHidden ? (
          <Button
            variant="subtle"
            color="var(--soft-blue)"
            radius="md"
            size="md"
            leftSection={<EyeIcon size={16} />}
            loading={unhideLoading}
            onClick={onUnhide}
          >
            Вернуть в список
          </Button>
        ) : (
          <Button
            variant="subtle"
            color="pink"
            size="md"
            radius="md"
            leftSection={<EyeSlashIcon size={16} />}
            onClick={onOpen}
          >
            Убрать из списка
          </Button>
        )}
      </Group>
      <Modal opened={opened} onClose={onClose} title="Убрать игру из списка?" centered>
        <Stack gap="md">
          <Text size="md">
            Игра <b>{game.title ?? `#${game.id}`}</b> исчезнет из основного списка. У
            других участников она останется.
          </Text>
          <Text c="dimmed">
            Прогресс и статистика не изменятся. Вернуть игру можно на разделе «Скрытые».
          </Text>
          <Group justify="flex-end">
            <Button
              color="var(--soft-blue)"
              variant="light"
              onClick={onClose}
              radius="md"
              size="md"
            >
              Отмена
            </Button>
            <Button
              color="pink"
              loading={hideLoading}
              onClick={onHide}
              radius="md"
              size="md"
            >
              Убрать
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
