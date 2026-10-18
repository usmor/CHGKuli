import { Badge, Button, Group, Text } from '@mantine/core';
import { BookOpenIcon, PauseIcon, PlayIcon, TimerIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import { useGameTimer } from '@/shared/lib/hooks';

type QuestionTimerProps = {
  seconds: number;
  resetKey: number;
  onTimeUp: () => void;
  onTick: (elapsed: number) => void;
  readTimeSeconds?: number;
};

export const QuestionTimer = ({
  seconds,
  resetKey,
  onTimeUp,
  onTick,
  readTimeSeconds = 10,
}: QuestionTimerProps): React.JSX.Element => {
  const [readSecondsLeft, setReadSecondsLeft] = useState(readTimeSeconds);
  const [isPreparing, setIsPreparing] = useState(true);

  useEffect(() => {
    setReadSecondsLeft(readTimeSeconds);
    setIsPreparing(true);
  }, [resetKey, readTimeSeconds]);

  useEffect(() => {
    if (!isPreparing || readSecondsLeft <= 0) return;

    const interval = window.setInterval(() => {
      setReadSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setIsPreparing(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return (): void => clearInterval(interval);
  }, [isPreparing, readSecondsLeft]);

  const timer = useGameTimer({
    seconds,
    enabled: !isPreparing,
    onTimeout: onTimeUp,
    resetKey,
  });

  const elapsed = seconds - timer.secondsLeft;

  useEffect((): void => {
    onTick(elapsed);
  }, [elapsed, onTick]);

  if (isPreparing) {
    return (
      <Badge
        size="lg"
        variant="light"
        color="var(--easter-purple)"
        radius="md"
        leftSection={<BookOpenIcon size={16} />}
        styles={{ label: { fontSize: 14 } }}
      >
        Время на чтение
      </Badge>
    );
  }

  if (timer.isTimeUp) {
    return (
      <Text size="xl" fw={700} c="pink">
        Время вышло
      </Text>
    );
  }

  return (
    <Group gap="xs">
      <TimerIcon size={20} />
      <Text size="xl" fw={700} c={timer.secondsLeft <= 5 ? 'pink' : undefined}>
        {timer.secondsLeft} с
      </Text>
      <Button
        variant="subtle"
        size="compact-md"
        radius="md"
        onClick={timer.isPaused ? timer.resume : timer.pause}
        color="var(--soft-blue)"
        leftSection={
          timer.isPaused ? (
            <PlayIcon size={14} weight="bold" />
          ) : (
            <PauseIcon size={14} weight="bold" />
          )
        }
      >
        {timer.isPaused ? 'Продолжить' : 'Пауза'}
      </Button>
    </Group>
  );
};
