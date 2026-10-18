import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  CrownIcon,
  FunnelIcon,
  GearIcon,
  PlayIcon,
  PlusIcon,
  UsersIcon,
} from '@phosphor-icons/react';
import { CustomAlert } from '@shared/ui';

import {
  AddPlayerModal,
  GameFiltersModal,
  GameFiltersSummary,
  GameSettingsModal,
} from '@/widgets';

import type { Game } from '@shared/types/game';

type GameLobbyUIProps = {
  game: Game;
  isOwner: boolean;
  isOwnerOrGuest: boolean;
  isStarting: boolean;
  startError: string | null;
  onStart: () => void;
  onRemovePlayer: (userId: number) => void;
  isRemovingPlayer: boolean;
};

export const GameLobbyUI = ({
  game,
  isOwner,
  isOwnerOrGuest,
  isStarting,
  startError,
  onStart,
  onRemovePlayer,
  isRemovingPlayer,
}: GameLobbyUIProps): React.JSX.Element => {
  const [settingsOpened, { open: openSettings, close: closeSettings }] =
    useDisclosure(false);
  const [filtersOpened, { open: openFilters, close: closeFilters }] =
    useDisclosure(false);
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);

  return (
    <Stack maw={1000} mx="auto" mt="xl" mb="xl" gap="lg" w="100%">
      <Card withBorder padding="xl" radius="md">
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Title order={2}>{game.title ?? 'Игра без названия'}</Title>
              <Text c="var(--purple-haze)" size="lg">
                {game.owner_id === null
                  ? 'Вы играете как гость'
                  : `Владелец: ${
                      game.players.find((p) => p.user_id === game.owner_id)?.username ??
                      '—'
                    }`}
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card withBorder padding="xl" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <GearIcon size={30} />
                <Title order={4}>Настройки</Title>
              </Group>
              {isOwnerOrGuest && (
                <Button
                  variant="subtle"
                  size="compact-md"
                  color="var(--soft-blue)"
                  onClick={openSettings}
                >
                  Редактировать
                </Button>
              )}
            </Group>

            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="md" c="dimmed">
                  Вопросов
                </Text>
                <Text fw={600}>{game.questions_count}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="md" c="dimmed">
                  Таймер
                </Text>
                <Text fw={600}>
                  {game.has_timer ? `${game.time_per_question} сек.` : 'Выключен'}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Card>

        <Card withBorder padding="xl" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <FunnelIcon size={30} />
                <Title order={4}>Фильтры</Title>
              </Group>
              {isOwnerOrGuest && (
                <Button
                  variant="subtle"
                  size="compact-md"
                  color="var(--soft-blue)"
                  onClick={openFilters}
                >
                  Изменить
                </Button>
              )}
            </Group>

            <GameFiltersSummary filters={game.filters} />
          </Stack>
        </Card>
      </SimpleGrid>

      <Card withBorder padding="xl" radius="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="xs">
              <UsersIcon size={30} />
              <Title order={4}>Игроки</Title>
            </Group>
            {isOwner && (
              <Button
                size="compact-md"
                color="var(--soft-blue)"
                variant="subtle"
                leftSection={<PlusIcon size={16} />}
                onClick={openAdd}
              >
                Добавить
              </Button>
            )}
          </Group>

          {game.players.length === 0 ? (
            <Text c="dimmed">
              Авторизуйтесь, чтобы добавить других игроков.{' '}
              {isOwner ? 'Добавьте игроков.' : ''}
            </Text>
          ) : (
            <Stack gap="xs">
              {game.players.map((p) => (
                <Group key={p.id} justify="space-between">
                  <Group gap="xs">
                    <Text size="md">{p.username}</Text>
                    {p.user_id === game.owner_id && (
                      <CrownIcon size={16} color="var(--crocus-purple)" weight="bold" />
                    )}
                  </Group>
                  {isOwner && p.user_id !== game.owner_id && (
                    <Button
                      variant="subtle"
                      color="pink"
                      size="compact-s"
                      loading={isRemovingPlayer}
                      onClick={() => onRemovePlayer(p.user_id)}
                    >
                      Удалить
                    </Button>
                  )}
                </Group>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>

      {startError && <CustomAlert title="Не удалось начать" message={startError} />}

      {isOwnerOrGuest && (
        <Group justify="center">
          <Button
            size="xl"
            radius="md"
            color="var(--crocus-purple)"
            leftSection={<PlayIcon size={20} />}
            loading={isStarting}
            onClick={onStart}
          >
            Начать игру
          </Button>
        </Group>
      )}

      <GameSettingsModal opened={settingsOpened} onClose={closeSettings} game={game} />
      <GameFiltersModal opened={filtersOpened} onClose={closeFilters} game={game} />
      <AddPlayerModal opened={addOpened} onClose={closeAdd} gameId={game.id} />
    </Stack>
  );
};
