import { Button, CheckIcon, Menu } from '@mantine/core';
import { ArrowsDownUpIcon } from '@phosphor-icons/react';

import type { QuestionSort } from '@shared/lib/hooks/useQuestionsFilters';

type SortOption = {
  value: QuestionSort;
  label: string;
};

const SORT_OPTIONS: SortOption[] = [
  { value: 'year_desc', label: 'Новые сначала' },
  { value: 'year_asc', label: 'Старые сначала' },
  { value: 'author', label: 'По автору' },
  { value: 'tournament', label: 'По турниру' },
  { value: 'random', label: 'Случайный порядок' },
];

type SortButtonProps = {
  value: QuestionSort;
  onChange: (value: QuestionSort) => void;
};

export const SortButton = ({ value, onChange }: SortButtonProps): React.JSX.Element => {
  return (
    <Menu position="bottom-end" shadow="md" width={220}>
      <Menu.Target>
        <Button
          fz={16}
          color="var(--soft-blue)"
          leftSection={<ArrowsDownUpIcon size={16} />}
        >
          Сортировка
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {SORT_OPTIONS.map((option) => (
          <Menu.Item
            fz={15}
            key={option.value}
            onClick={() => onChange(option.value)}
            rightSection={option.value === value ? <CheckIcon size={16} /> : null}
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
