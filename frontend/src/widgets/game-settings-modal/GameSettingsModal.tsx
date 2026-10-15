import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUpdateGame } from '@shared/lib/hooks';
import { CustomAlert } from '@shared/ui';

import type { Game } from '@shared/types/game';

type GameSettingsModalProps = {
  opened: boolean;
  onClose: () => void;
  game: Game;
};

export const GameSettingsModal = ({
  opened,
  onClose,
  game,
}: GameSettingsModalProps): React.JSX.Element => {
  const update = useUpdateGame(game.id);

  const form = useForm({
    initialValues: {
      title: game.title ?? '',
      questions_count: game.questions_count,
      has_timer: game.has_timer,
      time_per_question: game.time_per_question ?? 30,
    },
    validate: {
      questions_count: (v) => (v < 1 || v > 100 ? 'От 1 до 100' : null),
      time_per_question: (v, values) =>
        values.has_timer && (!v || v < 5 || v > 300) ? 'От 5 до 300 секунд' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    update.mutate(
      {
        title: values.title.trim() || undefined,
        questions_count: values.questions_count,
        has_timer: values.has_timer,
        time_per_question: values.has_timer ? values.time_per_question : undefined,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Настройки игры"
      centered
      size="md"
      styles={{ title: { fontSize: 20 } }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <TextInput
            label="Название"
            placeholder="Необязательно"
            size="md"
            {...form.getInputProps('title')}
          />
          <NumberInput
            label="Количество вопросов"
            min={1}
            max={100}
            size="md"
            {...form.getInputProps('questions_count')}
          />
          <Switch
            label="Таймер на вопрос"
            color="var(--crocus-purple)"
            radius="md"
            size="md"
            {...form.getInputProps('has_timer', { type: 'checkbox' })}
          />
          {form.values.has_timer && (
            <NumberInput
              label="Секунд на вопрос"
              min={5}
              max={300}
              size="md"
              {...form.getInputProps('time_per_question')}
            />
          )}

          {update.isError && (
            <CustomAlert message={update.error.message} title="Не удалось сохранить" />
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
              radius="md"
              size="md"
              type="submit"
              color="var(--easter-purple)"
              loading={update.isPending}
            >
              Сохранить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
