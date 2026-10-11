import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'chgkuli:question-progress';

type Progress = Record<number, boolean>;

const readProgress = (): Progress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Progress;
  } catch {
    return {};
  }
};

type UseQuestionProgressResult = {
  isPassed: boolean;
  toggle: () => void;
};

export const useQuestionProgress = (questionId: number): UseQuestionProgressResult => {
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const progress = readProgress();
    setIsPassed(Boolean(progress[questionId]));
  }, [questionId]);

  const toggle = useCallback((): void => {
    const progress = readProgress();
    const next = !progress[questionId];

    if (next) {
      progress[questionId] = true;
    } else {
      delete progress[questionId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    setIsPassed(next);
  }, [questionId]);

  return { isPassed, toggle };
};
