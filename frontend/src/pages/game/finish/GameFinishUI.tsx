import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { HouseIcon, RepeatIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import { CustomAlert } from '@/shared/ui';

import type { Game } from '@shared/types';

type GameFinishUIProps = {
  game: Game;
  isAuthorized: boolean;
  isClaiming: boolean;
  claimError: string | null;
};

export const GameFinishUI = ({
  game,
  isAuthorized,
  isClaiming,
  claimError,
}: GameFinishUIProps): React.JSX.Element => {
  const answered = game.answered_count;
  const total = game.questions_count;

  return (
    <Card withBorder padding="xl" radius="md" maw={600} mx="auto" mt="xl" mb="xl">
      <Stack gap="lg" align="center">
        <Title order={2} ta="center">
          Игра завершена
        </Title>

        <Stack gap={4} align="center">
          <Text fz={48} fw={800} lh={1}>
            {answered} / {total}
          </Text>
          <Text c="dimmed" size="lg">
            правильных ответов
          </Text>
        </Stack>

        {!isAuthorized && (
          <Stack gap="sm" align="center" w="100%">
            <Text c="dimmed" ta="center" maw={400}>
              Войдите или зарегистрируйтесь, чтобы сохранить результат в профиле и видеть
              историю игр.
            </Text>
            <Group gap="sm">
              <Button
                component={Link}
                to="/login"
                color="var(--crocus-purple)"
                radius="md"
                size="md"
                state={{ from: `/game/${game.id}` }}
              >
                Войти
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="light"
                size="md"
                radius="md"
                color="var(--crocus-purple)"
                state={{ from: `/game/${game.id}` }}
              >
                Зарегистрироваться
              </Button>
            </Group>

            {claimError && (
              <CustomAlert message={claimError} title="Что-то пошло не так" />
            )}
          </Stack>
        )}

        <Group gap="sm" mt="md">
          <Button
            component={Link}
            to="/game"
            leftSection={<RepeatIcon size={18} />}
            color="var(--easter-purple)"
            size="md"
            radius="md"
          >
            Сыграть ещё
          </Button>
          <Button
            component={Link}
            to="/"
            variant="light"
            color="var(--soft-blue)"
            size="md"
            radius="md"
            leftSection={<HouseIcon size={18} />}
          >
            На главную
          </Button>
        </Group>

        {isClaiming && (
          <Text size="sm" c="dimmed">
            Сохраняем результат…
          </Text>
        )}
      </Stack>
    </Card>
  );
};
