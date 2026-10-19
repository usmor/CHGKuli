import { MultiSelect } from '@mantine/core';
import { CalendarDotsIcon, PenNibIcon } from '@phosphor-icons/react';

import type { ReactNode } from 'react';

type Option = {
  value: string;
  label: string;
};

type AutoCompleteUIProps = {
  type: string;
  data: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  onSearchChange: (query: string) => void;
  placeholder?: string;
};

export const AutoCompleteUI = ({
  data,
  value,
  onChange,
  onSearchChange,
  placeholder = 'Найти...',
  type,
}: AutoCompleteUIProps): React.JSX.Element => {
  let icon: ReactNode = null;
  let color = 'var(--mantine-color-gray-6)';
  if (type === 'authors') {
    icon = <PenNibIcon size={16} />;
    color = 'var(--easter-purple)';
  } else if (type === 'tournaments') {
    icon = <CalendarDotsIcon size={16} />;
    color = 'var(--soft-blue)';
  }

  return (
    <MultiSelect
      size="md"
      data={data}
      value={value}
      onChange={onChange}
      onSearchChange={onSearchChange}
      rightSectionPointerEvents="none"
      rightSection={icon}
      placeholder={placeholder}
      checkIconPosition="right"
      searchable
      clearable
      nothingFoundMessage="Ничего не найдено..."
      comboboxProps={{
        transitionProps: { transition: 'pop', duration: 200 },
        dropdownPadding: 10,
        withinPortal: false,
        position: 'bottom',
        middlewares: { flip: false, shift: false },
      }}
      styles={{
        pill: {
          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
          color,
        },
        dropdown: {
          maxHeight: '300px',
          overflowY: 'auto',
        },
      }}
    />
  );
};
