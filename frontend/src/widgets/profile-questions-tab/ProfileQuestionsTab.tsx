import {
  useInfiniteScroll,
  usePassedQuestions,
  useQuestionFilters,
} from '@shared/lib/hooks';

import { ProfileQuestionsTabUI } from './ProfileQuestionsTabUI';

export const ProfileQuestionsTab = (): React.JSX.Element => {
  const { filters, setFilters, resetFilters } = useQuestionFilters();

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePassedQuestions(filters);

  const sentinelRef = useInfiniteScroll(() => void fetchNextPage(), {
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  const questions = data?.pages.flatMap((page) => page.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <ProfileQuestionsTabUI
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
