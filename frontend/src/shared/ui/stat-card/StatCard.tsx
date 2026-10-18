import { Card, Flex, Stack, Text } from '@mantine/core';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  joke: string;
};

export const StatCard = ({
  icon,
  label,
  value,
  joke,
}: StatCardProps): React.JSX.Element => (
  <Card withBorder padding="lg" radius="md">
    <Stack gap={10}>
      <Flex align="center" gap={8}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </span>
        <Text fw={600} size="lg" lh={1}>
          {label}
        </Text>
      </Flex>
      <Text fz={32} fw={800} lh={1}>
        {value}
      </Text>
      <Text c="dimmed" size="sm" style={{ marginTop: 'auto' }}>
        {joke}
      </Text>
    </Stack>
  </Card>
);
