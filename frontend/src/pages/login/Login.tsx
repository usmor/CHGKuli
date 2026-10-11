import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/shared/lib/hooks';
import { ApiError } from '@/shared/lib/api/fetcher';

import { LoginUI, type LoginFormValues } from './LoginUI';

export const Login = (): React.JSX.Element => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/profile';

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Введите email';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Некорректный email';
        return null;
      },
      password: (value) => {
        if (!value) return 'Введите пароль';
        if (value.length < 6) return 'Пароль должен быть не короче 6 символов';
        return null;
      },
    },
  });

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
      void navigate('/profile', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 || err.status === 401) {
          setServerError('Неверный email или пароль');
        } else if (err.status === 429) {
          setServerError('Слишком много попыток. Попробуйте позже.');
        } else {
          setServerError('Ошибка сервера. Попробуйте позже.');
        }
      } else {
        setServerError('Не удалось подключиться к серверу.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginUI
      form={form}
      serverError={serverError}
      isSubmitting={isSubmitting}
      onSubmit={(values) => void handleSubmit(values)}
    />
  );
};