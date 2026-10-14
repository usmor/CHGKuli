import {
  Button,
  Card,
  Group,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { KeyIcon, PencilIcon } from '@phosphor-icons/react';

import type { User } from '@shared/types/user';

type InfoPayload = {
  username?: string;
  email?: string;
};

type PasswordPayload = {
  current_password: string;
  password: string;
};

type Props = {
  user: User;
  isUpdating: boolean;
  isChangingPassword: boolean;
  onInfoSubmit: (payload: InfoPayload) => void;
  onPasswordSubmit: (payload: PasswordPayload) => void;
};

export const ProfileInfoTabUI = ({
  user,
  isUpdating,
  isChangingPassword,
  onInfoSubmit,
  onPasswordSubmit,
}: Props): React.JSX.Element => {
  const infoForm = useForm({
    initialValues: {
      username: user.username,
      email: user.email,
    },
    validate: {
      username: (v) => (v.length < 3 ? 'Минимум 3 символа' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Некорректный email'),
    },
  });

  const passwordForm = useForm({
    initialValues: {
      current_password: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      current_password: (v) => (v.length === 0 ? 'Введи текущий пароль' : null),
      password: (v) => (v.length < 6 ? 'Минимум 6 символов' : null),
      confirmPassword: (v, values) =>
        v !== values.password ? 'Пароли не совпадают' : null,
    },
  });

  const handleInfoSubmit = infoForm.onSubmit((values) => {
    const payload: InfoPayload = {};
    if (values.username !== user.username) payload.username = values.username;
    if (values.email !== user.email) payload.email = values.email;
    onInfoSubmit(payload);
  });

  const handlePasswordSubmit = passwordForm.onSubmit((values) => {
    onPasswordSubmit({
      current_password: values.current_password,
      password: values.password,
    });
    passwordForm.reset();
  });

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" w="100%">
      <Card withBorder padding="xl" radius="md" h="100%">
        <form onSubmit={handleInfoSubmit} style={{ height: '100%' }}>
          <Stack gap="lg" h="100%">
            <Group gap="xs">
              <PencilIcon size={22} />
              <Text size="lg" fw={600}>
                Личные данные
              </Text>
            </Group>

            <TextInput
              size="md"
              label="Имя пользователя"
              {...infoForm.getInputProps('username')}
            />
            <TextInput size="md" label="Email" {...infoForm.getInputProps('email')} />

            <Group justify="flex-end" mt="auto">
              <Button
                type="submit"
                loading={isUpdating}
                color="var(--crocus-purple)"
                size="md"
              >
                Сохранить
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>

      <Card withBorder padding="xl" radius="md" h="100%">
        <form onSubmit={handlePasswordSubmit} style={{ height: '100%' }}>
          <Stack gap="lg" h="100%">
            <Group gap="xs">
              <KeyIcon size={22} />
              <Text size="lg" fw={600}>
                Смена пароля
              </Text>
            </Group>

            <PasswordInput
              size="md"
              label="Текущий пароль"
              placeholder="Тот, которым входишь"
              {...passwordForm.getInputProps('current_password')}
            />
            <PasswordInput
              size="md"
              label="Новый пароль"
              placeholder="Минимум 6 символов"
              {...passwordForm.getInputProps('password')}
            />
            <PasswordInput
              size="md"
              label="Повтори новый пароль"
              placeholder="Чтобы точно не ошибиться"
              {...passwordForm.getInputProps('confirmPassword')}
            />

            <Group justify="flex-end" mt="auto">
              <Button
                type="submit"
                loading={isChangingPassword}
                color="var(--crocus-purple)"
                size="md"
              >
                Сменить пароль
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </SimpleGrid>
  );
};
