import { fetcher } from '@shared/lib/api/fetcher';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

type ChangePasswordPayload = {
  current_password: string;
  password: string;
};

export const useChangePassword = (): UseMutationResult<
  { status: string },
  Error,
  ChangePasswordPayload
> => {
  return useMutation<{ status: string }, Error, ChangePasswordPayload>({
    mutationFn: (payload) =>
      fetcher<{ status: string }>('/users/me/password', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
  });
};
