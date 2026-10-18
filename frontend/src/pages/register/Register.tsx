import { useForm } from '@mantine/form';
import { useAuth } from '@shared/lib/hooks';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ApiError } from '@/shared/lib/api/fetcher';

import { RegisterUI, type RegisterFormValues } from './RegisterUI';

export const Register = (): React.JSX.Element => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/profile';

  const form = useForm<RegisterFormValues>({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: {
      email: (value) => {
        if (!value) return 'Введите email';
        if (!/^\S+@\S+\.\S+$/.test(value)) return 'Некорректный email';
        return null;
      },
      username: (value) => {
        if (!value) return 'Введите имя пользователя';
        if (value.length < 3) return 'Минимум 3 символа';
        if (value.length > 50) return 'Максимум 50 символов';
        return null;
      },
      password: (value) => {
        if (!value) return 'Введите пароль';
        if (value.length < 6) return 'Пароль должен быть не короче 6 символов';
        return null;
      },
    },
  });

  const handleSubmit = async (values: RegisterFormValues): Promise<void> => {
    setServerError(null);
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(values.email, values.username, values.password);

      void navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.detail === 'USERNAME_ALREADY_EXISTS') {
          setServerError('Пользователь с таким именем уже существует');
        } else if (err.detail === 'EMAIL_ALREADY_EXISTS') {
          setServerError('Пользователь с таким email уже существует');
        } else if (err.status === 400) {
          setServerError('Пользователь с таким email или именем уже существует');
        } else if (err.status === 422) {
          setServerError('Проверьте правильность заполнения полей');
        } else if (err.status === 429) {
          setServerError('Слишком много попыток. Попробуйте позже.');
        } else {
          setServerError('Ошибка сервера. Попробуйте позже.');
        }
      } else {
        setServerError('Не удалось подключиться к серверу. Проверьте интернет.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterUI
      form={form}
      serverError={serverError}
      isSubmitting={isSubmitting}
      onSubmit={(values) => void handleSubmit(values)}
    />
  );
};
