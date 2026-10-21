import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { fetcher } from '../api';

import type { Question } from '@shared/types';

type UseRandomQuestionResult = {
  getRandomQuestion: () => void;
  isLoading: boolean;
};

export const useRandomQuestion = (): UseRandomQuestionResult => {
  const navigate = useNavigate();

  const mutation = useMutation<Question, Error, void>({
    mutationFn: () => fetcher<Question>('/questions/random'),
    onSuccess: (randomQuestion): void => {
      void navigate(`/questions/${randomQuestion.id}`);
    },
    onError: (): void => {
      console.error('Не удалось найти случайный вопрос');
    },
  });

  return {
    getRandomQuestion: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
