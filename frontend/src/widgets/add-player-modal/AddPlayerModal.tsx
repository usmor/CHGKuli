import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ApiError } from '@shared/lib/api/fetcher';
import { useGameActions } from '@shared/lib/hooks';

import { CustomAlert } from '@/shared/ui';

type AddPlayerModalProps = {
  opened: boolean;
  onClose: () => void;
  gameId: number;
};

export const AddPlayerModal = ({
  opened,
  onClose,
  gameId,
}: AddPlayerModalProps): React.JSX.Element => {
  const { addPlayer } = useGameActions(gameId);

  const form = useForm({
    initialValues: {
      username: '',
      daily_code: '',
    },
    validate: {
      username: (v) => (v.length < 3 ? 'Минимум 3 символа' : null),
      daily_code: (v) => (v.length !== 6 || !/^\d+$/.test(v) ? 'Ровно 6 цифр' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    addPlayer.mutate(values, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  });

  const errorMessage =
    addPlayer.error instanceof ApiError
      ? (addPlayer.error.detail ?? addPlayer.error.message)
      : (addPlayer.error?.message ?? null);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Добавить игрока"
      centered
      size="md"
      styles={{ title: { fontSize: 20 } }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <Text size="md" c="dimmed">
            Попросите игрока открыть профиль и сказать вам личный код на сегодня.
          </Text>

          <TextInput
            label="Имя пользователя"
            placeholder="username"
            size="md"
            {...form.getInputProps('username')}
          />
          <TextInput
            label="Личный код"
            placeholder="6 цифр"
            maxLength={6}
            size="md"
            {...form.getInputProps('daily_code')}
          />

          {errorMessage && (
            <CustomAlert title="Не удалось добавить" message={errorMessage} />
          )}

          <Group justify="flex-end">
            <Button
              color="var(--soft-blue)"
              variant="light"
              radius="md"
              size="md"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              radius="md"
              size="md"
              color="var(--easter-purple)"
              loading={addPlayer.isPending}
            >
              Добавить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
