import { useInfiniteScroll, useQuestions } from '@shared/lib/hooks';

import { AllQuestionsUI } from './AllQuestionsUI';

export const AllQuestions = (): React.JSX.Element => {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useQuestions(20);

  const sentinelRef = useInfiniteScroll(() => void fetchNextPage(), {
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

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
    />
  );
};
