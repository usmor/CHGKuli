import { useState } from 'react';

import { handlers } from '@/mocks/handlers';

import { FiltersBarUI } from './FiltersBarUI';

import type { QuestionFilters } from '@shared/lib/hooks';
import type { Author, Tournament } from '@shared/types';
import type { Meta, StoryObj } from '@storybook/react-vite';

import '@mantine/core/styles.css';

const meta: Meta<typeof FiltersBarUI> = {
  title: 'Widgets/FiltersBar/FiltersBarUI',
  component: FiltersBarUI,
  parameters: {
    layout: 'centered',
    msw: { handlers },
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FiltersBarUI>;

const Wrapper = ({
  initialFilters,
  initialAuthors = [],
  initialTournaments = [],
}: {
  initialFilters?: Partial<QuestionFilters>;
  initialAuthors?: Author[];
  initialTournaments?: Tournament[];
}): React.JSX.Element => {
  const [filters, setFilters] = useState<QuestionFilters>({
    author_ids: [],
    tournament_ids: [],
    year_from: null,
    year_to: null,
    limit: 20,
    ...initialFilters,
  });
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [tournaments, setTournaments] = useState<Tournament[]>(initialTournaments);

  return (
    <div style={{ width: 320 }}>
      <FiltersBarUI
        filters={filters}
        authors={authors}
        tournaments={tournaments}
        onAuthorsChange={setAuthors}
        onTournamentsChange={setTournaments}
        onApply={(next) => {
          console.log('Apply:', next);
          setFilters(next);
        }}
        onReset={() => {
          console.log('Reset');
          setFilters({
            author_ids: [],
            tournament_ids: [],
            year_from: null,
            year_to: null,
            limit: 20,
          });
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Wrapper />,
};

export const WithSelectedAuthors: Story = {
  render: () => (
    <Wrapper
      initialAuthors={[
        { id: 1, name: 'Юлия Дидбаридзе' },
        { id: 2, name: 'Григорий Зырянов' },
      ]}
    />
  ),
};

export const WithYears: Story = {
  render: () => (
    <Wrapper
      initialFilters={{
        year_from: 2020,
        year_to: 2023,
      }}
    />
  ),
};

export const FullFilters: Story = {
  render: () => (
    <Wrapper
      initialFilters={{
        year_from: 2009,
        year_to: 2023,
        limit: 50,
      }}
      initialAuthors={[{ id: 1, name: 'Юлия Дидбаридзе' }]}
      initialTournaments={[{ id: 2, name: 'Кубок Москвы по ЧГК', year: 2009 }]}
    />
  ),
};
