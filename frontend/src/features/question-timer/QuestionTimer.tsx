import { Button, Group, Text } from '@mantine/core';
import { PauseIcon, PlayIcon, TimerIcon } from '@phosphor-icons/react';
import { useEffect } from 'react';

import { useGameTimer } from '@/shared/lib/hooks';

type QuestionTimerProps = {
  seconds: number;
  resetKey: number;
  onTimeUp: () => void;
  onTick: (elapsed: number) => void;
};

export const QuestionTimer = ({
  seconds,
  resetKey,
  onTimeUp,
  onTick,
}: QuestionTimerProps): React.JSX.Element => {
  const timer = useGameTimer({
    seconds,
    enabled: true,
    onTimeout: onTimeUp,
    resetKey,
  });

  const elapsed = seconds - timer.secondsLeft;

  useEffect((): void => {
    onTick(elapsed);
  }, [elapsed, onTick]);

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
