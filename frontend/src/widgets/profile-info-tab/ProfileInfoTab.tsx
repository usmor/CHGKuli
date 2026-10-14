import { notifications } from '@mantine/notifications';
import { useChangePassword, useUpdateMe } from '@shared/lib/hooks';

import { ApiError } from '@/shared/lib/api/fetcher';

import { ProfileInfoTabUI } from './ProfileInfoTabUI';

import type { User } from '@shared/types/user';

type Props = { user: User };

export const ProfileInfoTab = ({ user }: Props): React.JSX.Element => {
  const update = useUpdateMe();
  const changePassword = useChangePassword();

  const handleInfoSubmit = (payload: { username?: string; email?: string }): void => {
    if (!payload.username && !payload.email) {
      notifications.show({
        message: 'Ничего не изменилось.',
        color: 'var(--purple-haze)',
      });
      return;
    }

    update.mutate(payload, {
      onSuccess: () => {
        notifications.show({
          message: 'Профиль обновлён.',
          color: 'var(--soft-blue)',
        });
      },
      onError: (err) => {
        let message = 'Не вышло. Попробуй ещё раз.';

        if (err instanceof ApiError) {
          if (err.detail === 'USERNAME_ALREADY_EXISTS') {
            message = 'Это имя уже занято. Выбери другое.';
          } else if (err.detail === 'EMAIL_ALREADY_EXISTS') {
            message = 'Этот email уже зарегистрирован.';
          } else if (err.detail === 'UPDATE_USER_ALREADY_EXISTS') {
            message = 'Такое имя или email уже заняты.';
          } else if (err.detail) {
            message = err.detail;
          } else if (err.status === 400) {
            message = 'Проверь данные и попробуй снова.';
          } else if (err.status === 401) {
            message = 'Ты не авторизован. Войди заново.';
          } else if (err.status === 422) {
            message = 'Данные не прошли проверку.';
          } else if (err.status === 429) {
            message = 'Слишком много попыток. Попробуй позже.';
          } else if (err.status >= 500) {
            message = 'Что-то сломалось на сервере. Мы уже чиним.';
          }
        } else {
          message = 'Не удалось подключиться к серверу.';
        }

        notifications.show({
          message,
          color: 'pink',
        });
      },
    });
  };

  const handlePasswordSubmit = (payload: {
    current_password: string;
    password: string;
  }): void => {
    changePassword.mutate(payload, {
      onSuccess: () => {
        notifications.show({
          message: 'Пароль обновлён. Не забудь его.',
          color: 'var(--soft-blue)',
        });
      },
      onError: (err) => {
        let message = 'Пароль не подошёл. Или что-то ещё.';

        if (err instanceof ApiError) {
          if (err.detail) {
            message = err.detail;
          } else if (err.status === 400) {
            message = 'Неверный текущий пароль.';
          } else if (err.status === 401) {
            message = 'Ты не авторизован. Войди заново.';
          } else if (err.status === 422) {
            message = 'Пароль не прошёл проверку. Минимум 6 символов.';
          } else if (err.status === 429) {
            message = 'Слишком много попыток. Попробуй позже.';
          } else if (err.status >= 500) {
            message = 'Что-то сломалось на сервере. Мы уже чиним.';
          }
        } else {
          message = 'Не удалось подключиться к серверу.';
        }

        notifications.show({
          message,
          color: 'pink',
        });
      },
    });
  };

  return (
    <ProfileInfoTabUI
      user={user}
      isUpdating={update.isPending}
      isChangingPassword={changePassword.isPending}
      onInfoSubmit={handleInfoSubmit}
      onPasswordSubmit={handlePasswordSubmit}
    />
  );
};
