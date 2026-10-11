import { Badge } from '@mantine/core';

type ProgressBadgeProps = {
  isPassed: boolean;
};

export const ProgressBadge = ({
  isPassed,
}: ProgressBadgeProps): React.JSX.Element | null => {
  if (!isPassed) return null;

  return (
    <Badge color="var(--crocus-purple)" variant="filled" radius="md">
      ✓
    </Badge>
  );
};
