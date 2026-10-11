import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { fetcher } from '@/shared/lib/api/fetcher';

import { useAuth } from './useAuth';

type PassedQuestionsResponse = {
  question_ids: number[];
  total: number;
};

type UseQuestionProgressResult = {
  isPassed: boolean;
  togglePassed: () => void;
  isLoading: boolean;
};

export const useQuestionProgress = (questionId: number): UseQuestionProgressResult => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data } = useQuery<PassedQuestionsResponse>({
    queryKey: ['progress', 'passed'],
    queryFn: (): Promise<PassedQuestionsResponse> =>
      fetcher<PassedQuestionsResponse>('/progress/passed'),
    enabled: Boolean(user),
  });

  const passedIds = data?.question_ids ?? [];
  const isPassed = passedIds.includes(questionId);
  const markMutation = useMutation({
    mutationFn: () => fetcher(`/progress/${questionId}/passed`, { method: 'POST' }),
    onSuccess: (): void => {
      void queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const unmarkMutation = useMutation({
    mutationFn: (): Promise<void> =>
      fetcher(`/progress/${questionId}/passed`, { method: 'DELETE' }),
    onSuccess: (): void => {
      void queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const togglePassed = useCallback((): void => {
    if (isPassed) {
      unmarkMutation.mutate();
    } else {
      markMutation.mutate();
    }
  }, [isPassed, markMutation, unmarkMutation]);

  return {
    isPassed,
    togglePassed,
    isLoading: markMutation.isPending || unmarkMutation.isPending,
  };
};
