import { useInfiniteScroll, useQuestionFilters, useQuestions } from '@shared/lib/hooks';
import { useEffect } from 'react';

import { AllQuestionsUI } from './AllQuestionsUI';

export const AllQuestions = (): React.JSX.Element => {
  const { filters, setFilters, resetFilters } = useQuestionFilters();

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQuestions(filters);

  const sentinelRef = useInfiniteScroll(() => void fetchNextPage(), {
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const questions = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <AllQuestionsUI
      questions={questions}
      total={total}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage ?? false}
      error={error}
      sentinelRef={sentinelRef}
      filters={filters}
      onFiltersChange={setFilters}
      onFiltersReset={resetFilters}
    />
  );
};
