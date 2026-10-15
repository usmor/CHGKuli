import { Button, Group, Modal, Stack } from '@mantine/core';
import { useUpdateGame } from '@shared/lib/hooks';
import { FiltersBar } from '@widgets/index';
import { useState } from 'react';

import type { QuestionFilters } from '@shared/lib/hooks';
import type { Game } from '@shared/types';

type GameFiltersModalProps = {
  opened: boolean;
  onClose: () => void;
  game: Game;
};

export const GameFiltersModal = ({
  opened,
  onClose,
  game,
}: GameFiltersModalProps): React.JSX.Element => {
  const update = useUpdateGame(game.id);

  const [filters, setFilters] = useState<QuestionFilters>({
    author_ids: game.filters?.author_ids ?? [],
    tournament_ids: game.filters?.tournament_ids ?? [],
    year_from: game.filters?.year_from ?? null,
    year_to: game.filters?.year_to ?? null,
    sort: 'random',
  });

  const handleSave = (): void => {
    update.mutate(
      {
        filters: {
          author_ids: filters.author_ids,
          tournament_ids: filters.tournament_ids,
          year_from: filters.year_from,
          year_to: filters.year_to,
        },
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal opened={opened} onClose={onClose} centered size="md">
      <Stack gap="lg">
        <FiltersBar
          filters={filters}
          onApply={setFilters}
          onReset={() =>
            setFilters({
              author_ids: [],
              tournament_ids: [],
              year_from: null,
              year_to: null,
              sort: 'random',
            })
          }
          autoApply
          bare
        />

        <Group justify="flex-end" px="lg" pb="lg">
          <Button
            color="var(--soft-blue)"
            variant="light"
            radius="md"
            size="md"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button
            radius="md"
            size="md"
            type="submit"
            color="var(--easter-purple)"
            loading={update.isPending}
            onClick={handleSave}
          >
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
