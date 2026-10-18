import { useCallback, useRef } from 'react';

export const useTimerSound = (): (() => void) => {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    ctxRef.current ??= new AudioContext();
    const ctx = ctxRef.current;

    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const playBeep = (startTime: number, frequency: number, duration: number): void => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playBeep(now, 880, 0.15);
    playBeep(now + 0.2, 660, 0.25);
  }, []);
};
