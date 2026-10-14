import { fetcher } from '@shared/lib/api/fetcher';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { useAuth } from './useAuth';

import type { User } from '@shared/types/user';

type UpdatePayload = {
  email?: string;
  username?: string;
  password?: string;
};

export const useUpdateMe = (): UseMutationResult<User, Error, UpdatePayload> => {
  const { setUser } = useAuth();

  return useMutation<User, Error, UpdatePayload>({
    mutationFn: (payload) =>
      fetcher<User>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    onSuccess: (user) => {
      setUser(user);
    },
  });
};
