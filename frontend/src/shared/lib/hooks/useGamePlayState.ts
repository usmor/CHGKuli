import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Game } from '@shared/types';

type QuestionStatus = 'pending' | 'correct' | 'wrong';

export type GamePlayState = {
  currentIndex: number;
  statuses: QuestionStatus[];
  showAnswer: boolean;
  isTimeUp: boolean;
  timeSpent: number;
  isFinished: boolean;
  currentQuestion: Game['questions'][number] | undefined;
  showAnswerNow: () => void;
  markTimeUp: () => void;
  markCorrect: () => void;
  markWrong: () => void;
  setTimeSpent: (n: number) => void;
};

export const useGamePlayState = (game: Game): GamePlayState => {
  const initialStatuses = useMemo<QuestionStatus[]>(
    () =>
      game.questions.map((q) => {
        if (q.is_answered) return 'correct';
        if (q.is_seen) return 'wrong';
        return 'pending';
      }),
    [game.questions]
  );

  const firstUnanswered = useMemo(
    () => initialStatuses.findIndex((s) => s === 'pending'),
    [initialStatuses]
  );

  const [currentIndex, setCurrentIndex] = useState(
    firstUnanswered === -1 ? initialStatuses.length : firstUnanswered
  );
  const [statuses, setStatuses] = useState<QuestionStatus[]>(initialStatuses);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const currentQuestion = game.questions[currentIndex];

  useEffect(() => {
    const q = game.questions[currentIndex];
    if (q?.is_seen) {
      setShowAnswer(true);
    } else {
      setShowAnswer(false);
      setIsTimeUp(false);
      setTimeSpent(0);
    }
  }, [currentIndex, game.questions]);

  const showAnswerNow = useCallback((): void => {
    setShowAnswer(true);
  }, []);

  const markTimeUp = useCallback((): void => {
    setIsTimeUp(true);
  }, []);

  const next = useCallback((): void => {
    setCurrentIndex((i) => i + 1);
  }, []);

  const markCorrect = useCallback((): void => {
    setStatuses((prev) => {
      const copy = [...prev];
      copy[currentIndex] = 'correct';
      return copy;
    });
    next();
  }, [currentIndex, next]);

  const markWrong = useCallback((): void => {
    setStatuses((prev) => {
      const copy = [...prev];
      copy[currentIndex] = 'wrong';
      return copy;
    });
    next();
  }, [currentIndex, next]);

  return {
    currentIndex,
    statuses,
    showAnswer,
    isTimeUp,
    timeSpent,
    isFinished: currentIndex >= game.questions.length,
    currentQuestion,
    showAnswerNow,
    markTimeUp,
    markCorrect,
    markWrong,
    setTimeSpent,
  };
};
