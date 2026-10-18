import { Group } from '@mantine/core';
import { CheckIcon, CircleIcon, XIcon } from '@phosphor-icons/react';

type QuestionStatus = 'pending' | 'correct' | 'wrong';

type QuestionProgressProps = {
  statuses: QuestionStatus[];
  currentIndex: number;
};

export const QuestionProgress = ({
  statuses,
  currentIndex,
}: QuestionProgressProps): React.JSX.Element => (
  <Group gap="xs" justify="center">
    {statuses.map((status, i) => {
      const isCurrent = i === currentIndex;
      const color = isCurrent
        ? 'var(--crocus-purple)'
        : status === 'correct'
          ? 'var(--soft-blue)'
          : status === 'wrong'
            ? 'rgb(166, 30, 77)'
            : 'var(--purple-haze)';

      const Icon =
        status === 'correct' ? CheckIcon : status === 'wrong' ? XIcon : CircleIcon;

      return (
        <Icon
          key={i}
          size={isCurrent ? 24 : 20}
          weight={isCurrent ? 'bold' : 'regular'}
          color={color}
        />
      );
    })}
  </Group>
);
