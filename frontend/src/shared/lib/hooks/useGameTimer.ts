import { useCallback, useEffect, useRef, useState } from 'react';

import { useTimerSound } from './useTimerSound';

type Options = {
  seconds: number;
  enabled: boolean;
  onTimeout?: () => void;
  resetKey: number;
};

type Result = {
  secondsLeft: number;
  isPaused: boolean;
  isTimeUp: boolean;
  pause: () => void;
  resume: () => void;
  reset: () => void;
};

export const useGameTimer = ({
  seconds,
  enabled,
  onTimeout,
  resetKey,
}: Options): Result => {
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const playTimerSound = useTimerSound();

  useEffect(() => {
    setSecondsLeft(seconds);
    setIsPaused(false);
    setIsTimeUp(false);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (!enabled || isPaused || isTimeUp || secondsLeft <= 0) return;

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsTimeUp(true);
          playTimerSound();
          onTimeout?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return (): void => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, isPaused, isTimeUp, secondsLeft, onTimeout, playTimerSound]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const reset = useCallback(() => {
    setSecondsLeft(seconds);
    setIsPaused(false);
    setIsTimeUp(false);
  }, [seconds]);

  return { secondsLeft, isPaused, isTimeUp, pause, resume, reset };
};
