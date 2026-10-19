import { ActionIcon, Tooltip } from '@mantine/core';

type ProgressBadgeProps = {
  isPassed: boolean;
  onRemove?: () => void;
  isLoading?: boolean;
};

export const ProgressBadge = ({
  isPassed,
  onRemove,
  isLoading = false,
}: ProgressBadgeProps): React.JSX.Element | null => {
  if (!isPassed || !onRemove) return null;

  const handleRemoveClick = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
    <Tooltip label="Убрать из пройденных" arrowPosition="center" arrowSize={4} withArrow>
      <ActionIcon
        variant="filled"
        color="var(--crocus-purple)"
        radius="md"
        size={20}
        w={40}
        onClick={handleRemoveClick}
        loading={isLoading}
        title="Убрать из пройденных"
      >
        ✓
      </ActionIcon>
    </Tooltip>
  );
};
