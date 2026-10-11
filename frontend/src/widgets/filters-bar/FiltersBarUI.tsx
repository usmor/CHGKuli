import { AutoComplete } from '@features/autocomplete';
import { Button, Divider, NumberInput, Stack, Text, Title } from '@mantine/core';
import { FunnelIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import type { QuestionFilters } from '@shared/lib/hooks';
import type { Author, SearchItem, Tournament } from '@shared/types';

import classes from './FiltersBar.module.css';

type FiltersBarUIProps = {
  filters: QuestionFilters;
  authors: Author[];
  tournaments: Tournament[];
  onAuthorsChange: (authors: Author[]) => void;
  onTournamentsChange: (tournaments: Tournament[]) => void;
  onApply: (filters: QuestionFilters) => void;
  onReset: () => void;
};

export const FiltersBarUI = ({
  filters,
  authors,
  tournaments,
  onAuthorsChange,
  onTournamentsChange,
  onApply,
  onReset,
}: FiltersBarUIProps): React.JSX.Element => {
  const [yearFrom, setYearFrom] = useState<number | null>(filters.year_from);
  const [yearTo, setYearTo] = useState<number | null>(filters.year_to);

  useEffect(() => {
    setYearFrom(filters.year_from);
    setYearTo(filters.year_to);
  }, [filters]);

  const handleApply = (): void => {
    onApply({
      author_ids: authors.map((a) => a.id),
      tournament_ids: tournaments.map((t) => t.id),
      year_from: yearFrom,
      year_to: yearTo,
      sort: filters.sort,
    });
  };

  const handleReset = (): void => {
    setYearFrom(null);
    setYearTo(null);
    onAuthorsChange([]);
    onTournamentsChange([]);
    onReset();
  };

  const handleTournamentsChange = (items: SearchItem[]): void => {
    onTournamentsChange(items as Tournament[]);
  };

  const handleAuthorsChange = (items: SearchItem[]): void => {
    onAuthorsChange(items);
  };

  return (
    <aside className={classes.sidebar}>
      <Stack gap="lg">
        <Title order={4} className={classes.header}>
          <FunnelIcon size={30} weight="bold" />
          Фильтры
        </Title>

        <Divider />

        <Stack gap="xs">
          <Text fw={600}>Годы</Text>
          <NumberInput
            value={yearFrom ?? ''}
            onChange={(value) => setYearFrom(value ? Number(value) : null)}
            min={1800}
            max={2100}
            placeholder="С"
          />
          <NumberInput
            value={yearTo ?? ''}
            onChange={(value) => setYearTo(value ? Number(value) : null)}
            min={1800}
            max={2100}
            placeholder="По"
          />
        </Stack>

        <Divider />

        <Stack gap="xs">
          <Text fw={600}>Авторы</Text>
          <AutoComplete
            type="authors"
            placeholder="Найти автора..."
            value={authors}
            onChange={handleAuthorsChange}
          />
        </Stack>

        <Divider />

        <Stack gap="xs">
          <Text fw={600}>Турниры</Text>
          <AutoComplete
            type="tournaments"
            placeholder="Найти турнир..."
            value={tournaments}
            onChange={handleTournamentsChange}
          />
        </Stack>

        <Divider />

        <Stack gap="sm">
          <Button onClick={handleApply} color="var(--crocus-purple)" fullWidth fz={16}>
            Применить
          </Button>
          <Button onClick={handleReset} variant="light" color="gray" fullWidth fz={16}>
            Сбросить
          </Button>
        </Stack>
      </Stack>
    </aside>
  );
};
