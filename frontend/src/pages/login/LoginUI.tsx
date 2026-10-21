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

import { CustomAlert, Seo } from '@/shared/ui';

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
    <>
      <Seo title="Вход" noIndex />
      <Center>
        <Card withBorder w="100%" className={classes.card}>
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
    </>
  );
};
