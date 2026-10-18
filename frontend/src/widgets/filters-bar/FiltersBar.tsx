import { useByIds, type QuestionFilters } from '@shared/lib/hooks';
import { useEffect, useState } from 'react';

import { FiltersBarUI } from './FiltersBarUI';

import type { Author, Tournament } from '@/shared/types';

type FiltersBarProps = {
  filters: QuestionFilters;
  onApply: (filters: QuestionFilters) => void;
  onReset: () => void;
  autoApply?: boolean;
  bare?: boolean;
};

export const FiltersBar = ({
  filters,
  onApply,
  onReset,
  autoApply = false,
  bare = false,
}: FiltersBarProps): React.JSX.Element => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const { data: authorsByIds } = useByIds('authors', filters.author_ids);
  const { data: tournamentsByIds } = useByIds('tournaments', filters.tournament_ids);

  useEffect(() => {
    if (authorsByIds) setAuthors(authorsByIds);
  }, [authorsByIds]);

  useEffect(() => {
    if (tournamentsByIds) setTournaments(tournamentsByIds as Tournament[]);
  }, [tournamentsByIds]);

  return (
    <FiltersBarUI
      filters={filters}
      authors={authors}
      tournaments={tournaments}
      onAuthorsChange={setAuthors}
      onTournamentsChange={setTournaments}
      onApply={onApply}
      onReset={onReset}
      autoApply={autoApply}
      bare={bare}
    />
  );
};
