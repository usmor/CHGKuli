import { Card, Stack, Title, Text } from '@mantine/core';

import type { User } from '@shared/types/user';
import type React from 'react';

export type ProfileUIProps = {
  user: User;
};

export const ProfileUI = ({ user }: ProfileUIProps): React.JSX.Element => {
  return (
    <Card withBorder padding="xl" maw={500} mx="auto" mt="xl">
      <Stack gap="md">
        <Title order={2}>Личный кабинет</Title>
        <Text>
          Имя: <b>{user.username}</b>
        </Text>
        <Text>Email: {user.email}</Text>
      </Stack>
    </Card>
  );
};
