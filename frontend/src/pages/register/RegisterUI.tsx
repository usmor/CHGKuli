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

import classes from './Register.module.css';

export type RegisterFormValues = {
  email: string;
  username: string;
  password: string;
};

type RegisterUIProps = {
  form: UseFormReturnType<RegisterFormValues>;
  serverError: string | null;
  isSubmitting: boolean;
  onSubmit: (values: RegisterFormValues) => void;
};

export const RegisterUI = ({
  form,
  serverError,
  isSubmitting,
  onSubmit,
}: RegisterUIProps): React.JSX.Element => {
  return (
    <>
      <Seo title="Регистрация" noIndex />
      <Center>
        <Card withBorder padding="xl" w={400} mt={20}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(form.values);
            }}
            noValidate
          >
            <Stack gap="md">
              <Title order={2}>Регистрация</Title>

              {serverError && (
                <CustomAlert title="Не удалось войти" message={serverError} />
              )}

              <TextInput
                label="Email"
                type="email"
                size="md"
                {...form.getInputProps('email')}
              />
              <TextInput
                label="Имя пользователя"
                size="md"
                {...form.getInputProps('username')}
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
                Зарегистрироваться
              </Button>

              <Text ta="center">
                Уже есть аккаунт?{' '}
                <Link to="/login" className={classes.link}>
                  Войти
                </Link>
              </Text>
            </Stack>
          </form>
        </Card>
      </Center>
    </>
  );
};
