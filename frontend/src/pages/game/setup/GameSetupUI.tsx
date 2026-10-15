import {
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Switch,
  TextInput,
  Text,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { PlayIcon } from '@phosphor-icons/react';
import { CustomAlert } from '@shared/ui';
import { FiltersBar } from '@widgets/index';
import { useState } from 'react';

import type { QuestionFilters } from '@shared/lib/hooks';
import type { GameFilters } from '@shared/types/game';

type GameSetupUIProps = {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (payload: {
    title?: string;
    questions_count: number;
    has_timer: boolean;
    time_per_question?: number;
    filters?: GameFilters;
  }) => void;
};

const emptyFilters: QuestionFilters = {
  author_ids: [],
  tournament_ids: [],
  year_from: null,
  year_to: null,
  sort: 'random',
};

export const GameSetupUI = ({
  isSubmitting,
  error,
  onSubmit,
}: GameSetupUIProps): React.JSX.Element => {
  const [filters, setFilters] = useState<QuestionFilters>(emptyFilters);

  const form = useForm({
    initialValues: {
      title: '',
      questions_count: 10,
      has_timer: false,
      time_per_question: 30,
    },
    validate: {
      questions_count: (v) => (v < 1 || v > 100 ? 'От 1 до 100' : null),
      time_per_question: (v, values) =>
        values.has_timer && (!v || v < 5 || v > 600) ? 'От 5 до 600 секунд' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit({
      title: values.title.trim() || undefined,
      questions_count: values.questions_count,
      has_timer: values.has_timer,
      time_per_question: values.has_timer ? values.time_per_question : undefined,
      filters: {
        author_ids: filters.author_ids,
        tournament_ids: filters.tournament_ids,
        year_from: filters.year_from,
        year_to: filters.year_to,
      },
    });
  });

  return (
    <Group align="stretch" gap="xl" p="xl" wrap="nowrap" w="90%" mx="auto">
      <FiltersBar
        filters={filters}
        onApply={setFilters}
        onReset={() => setFilters(emptyFilters)}
        autoApply={true}
      />

      <Card withBorder padding="xl" radius="md" style={{ flex: 1, display: 'flex' }}>
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          <Stack gap="lg" style={{ flex: 1 }}>
            <Title order={4}>Настройки игры</Title>
            <Text c="var(--purple-haze)" maw={700} size="md">
              Выберите, какие вопросы попадут в игру, настройте таймер и количество — а
              после старта сможете добавить игроков.
            </Text>

            <TextInput
              label="Название"
              placeholder="Необязательно"
              size="md"
              {...form.getInputProps('title')}
            />

            <NumberInput
              label="Количество вопросов"
              description="От 1 до 100"
              min={1}
              max={100}
              size="md"
              {...form.getInputProps('questions_count')}
            />

            <Switch
              label="Таймер на вопрос"
              size="md"
              radius="md"
              color="var(--crocus-purple)"
              styles={{
                label: {
                  fontSize: 16,
                  fontWeight: 500,
                },
                track: {
                  backgroundColor: 'var(--purple-haze)',
                  borderColor: 'var(--purple-haze)',
                },
              }}
              {...form.getInputProps('has_timer', { type: 'checkbox' })}
            />

            {form.values.has_timer && (
              <NumberInput
                label="Секунд на вопрос"
                description="От 5 до 300"
                min={5}
                max={300}
                size="md"
                {...form.getInputProps('time_per_question')}
              />
            )}

            {error && <CustomAlert title="Не удалось создать игру" message={error} />}

            <Group justify="flex-end" mt="auto">
              <Button
                type="submit"
                loading={isSubmitting}
                color="var(--soft-blue)"
                size="lg"
                radius="md"
                leftSection={<PlayIcon size={18} />}
              >
                Создать игру
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Group>
  );
};
