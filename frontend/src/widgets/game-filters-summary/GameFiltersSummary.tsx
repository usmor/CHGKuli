import { Badge, Group, Stack, Text } from '@mantine/core';
import { useByIds } from '@shared/lib/hooks';

import type { GameFilters } from '@shared/types';

type GameFiltersSummaryProps = {
  filters: GameFilters | null;
};

export const GameFiltersSummary = ({
  filters,
}: GameFiltersSummaryProps): React.JSX.Element => {
  const authorIds = filters?.author_ids ?? [];
  const tournamentIds = filters?.tournament_ids ?? [];

  const { data: authors } = useByIds('authors', authorIds);
  const { data: tournaments } = useByIds('tournaments', tournamentIds);

  const yearFrom = filters?.year_from ?? null;
  const yearTo = filters?.year_to ?? null;
  const hasYears = yearFrom !== null || yearTo !== null;
  const hasAny = authorIds.length > 0 || tournamentIds.length > 0 || hasYears;

  if (!hasAny) {
    return <Text size="sm">Не заданы: вопросы берутся из всей базы</Text>;
  }

  return (
    <Stack gap="sm">
      {hasYears && (
        <Stack gap={4}>
          <Text size="md" c="dimmed">
            Годы
          </Text>
          <Text size="md">
            {yearFrom ?? '…'} — {yearTo ?? '…'}
          </Text>
        </Stack>
      )}

      {authorIds.length > 0 && (
        <Stack gap={4}>
          <Text size="md" c="dimmed">
            Авторы
          </Text>
          <Group gap="xs">
            {authors?.map((a) => (
              <Badge key={a.id} variant="light" color="var(--easter-purple)" radius="md">
                {a.name}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}

      {tournamentIds.length > 0 && (
        <Stack gap={4}>
          <Text size="md" c="dimmed">
            Турниры
          </Text>
          <Group gap="xs">
            {tournaments?.map((t) => (
              <Badge key={t.id} variant="light" color="var(--soft-blue)" radius="md">
                {t.name}
              </Badge>
            ))}
          </Group>
        </Stack>
      )}
    </Stack>
  );
};
