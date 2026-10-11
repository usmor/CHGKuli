import {
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';

import { CustomAlert } from '@/shared/ui';

import type { UseFormReturnType } from '@mantine/form';

import classes from './Login.module.css';

export type LoginFormValues = {
  email: string;
  password: string;
};

type LoginUIProps = {
  form: UseFormReturnType<LoginFormValues>;
  serverError: string | null;
  isSubmitting: boolean;
  onSubmit: (values: { email: string; password: string }) => void;
};

export const LoginUI = ({
  form,
  onSubmit,
  serverError,
  isSubmitting,
}: LoginUIProps): React.JSX.Element => {
  return (
    <Center>
      <Card withBorder padding="xl" w={400} mt={20}>
        <form onSubmit={form.onSubmit(onSubmit)} noValidate>
          <Stack gap="md">
            {serverError && (
              <CustomAlert title="Не удалось войти" message={serverError} />
            )}
            <Title order={2}>Вход</Title>

            <TextInput
              label="Email"
              type="email"
              size="md"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              label="Пароль"
              size="md"
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              color="var(--crocus-purple)"
              loading={isSubmitting}
              size="md"
            >
              Войти
            </Button>

            <Text ta="center">
              Нет аккаунта?{' '}
              <Link to="/register" className={classes.link}>
                Зарегистрироваться
              </Link>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
};
