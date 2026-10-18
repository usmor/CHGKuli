import { Button, Card, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { CustomLoader, QuestionProgress } from '@shared/ui';

import { QuestionTimer } from '@/features/question-timer';

import type { GamePlayState } from '@/shared/lib/hooks';
import type { Game } from '@shared/types';

type GamePlayUIProps = {
  game: Game;
  state: GamePlayState;
  onCorrect: () => void;
  onWrong: () => void;
  onFinish: () => void;
  isSubmitting: boolean;
};

export const GamePlayUI = ({
  game,
  state,
  onCorrect,
  onWrong,
  onFinish,
  isSubmitting,
}: GamePlayUIProps): React.JSX.Element => {
  if (state.isFinished) {
    return (
      <Stack maw={700} mx="auto" mt="xl" gap="lg">
        <Title order={2}>Все вопросы пройдены!</Title>
        <Button size="lg" color="var(--crocus-purple)" onClick={onFinish} radius="md">
          Завершить игру
        </Button>
      </Stack>
    );
  }

  if (!state.currentQuestion) {
    return <CustomLoader />;
  }

  const gq = state.currentQuestion;
  const question = gq.question;
  const hasTimer = game.has_timer && game.time_per_question !== null;
  const hideQuestion = state.isTimeUp && !state.showAnswer;

  return (
    <Card withBorder padding="xl" radius="md" w={800} mx="auto" mt="xl" mb="xl">
      <Stack gap="lg">
        <QuestionProgress statuses={state.statuses} currentIndex={state.currentIndex} />

        <Group justify="space-between">
          <Text size="md" c="dimmed" fw={600}>
            Вопрос {state.currentIndex + 1} из {game.questions.length}
          </Text>

          {hasTimer && !state.showAnswer && (
            <QuestionTimer
              seconds={game.time_per_question!}
              resetKey={state.currentIndex}
              onTimeUp={state.markTimeUp}
              onTick={state.setTimeSpent}
            />
          )}
        </Group>

        {!hideQuestion && <Text size="lg">{question.question_text}</Text>}

        {hideQuestion && (
          <Text size="lg" c="dimmed" ta="center">
            Время вышло. Нажмите кнопку, чтобы увидеть ответ.
          </Text>
        )}

        {!state.showAnswer && (
          <Button
            mt="xl"
            size="lg"
            color={state.isTimeUp ? 'pink' : 'var(--crocus-purple)'}
            onClick={state.showAnswerNow}
            radius="md"
          >
            {!hasTimer
              ? 'Ответить'
              : state.isTimeUp
                ? 'Время вышло. Показать ответ'
                : 'Ответить досрочно'}
          </Button>
        )}

        {state.showAnswer && (
          <Stack gap="md">
            <Card
              withBorder
              padding="md"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--soft-blue) 10%, white)',
                borderColor: 'var(--soft-blue)',
              }}
            >
              <Stack gap="sm">
                <div>
                  <Text fw={600} mb={4} size="lg" c="var(--purple-haze)">
                    Ответ
                  </Text>
                  <Text>{question.answer}</Text>
                </div>

                {question.pass_criteria && (
                  <div>
                    <Text c="var(--purple-haze)" fw={600} mb={4} size="md">
                      Критерии зачёта
                    </Text>
                    <Text size="md">{question.pass_criteria}</Text>
                  </div>
                )}

                {question.comment && (
                  <div>
                    <Text fw={600} mb={4} size="md">
                      Комментарий
                    </Text>
                    <Text size="md">{question.comment}</Text>
                  </div>
                )}

                {(Boolean(question.tournament) || question.authors.length > 0) && (
                  <>
                    <Divider />
                    <Stack gap={4}>
                      {question.tournament && (
                        <Group gap="xs" wrap="nowrap" align="flex-start">
                          <Text size="sm" c="var(--purple-haze)" w={80}>
                            Турнир
                          </Text>
                          <Text size="sm">
                            {question.tournament.name}
                            {question.tournament.year
                              ? ` (${question.tournament.year})`
                              : ''}
                          </Text>
                        </Group>
                      )}

                      {question.authors.length > 0 && (
                        <Group gap="xs" wrap="nowrap" align="flex-start">
                          <Text size="sm" c="var(--purple-haze)" w={80}>
                            {question.authors.length === 1 ? 'Автор' : 'Авторы'}
                          </Text>
                          <Text size="sm">
                            {question.authors.map((a) => a.name).join(', ')}
                          </Text>
                        </Group>
                      )}
                    </Stack>
                  </>
                )}
              </Stack>
            </Card>

            {!gq.is_seen && (
              <Group grow>
                <Button
                  size="lg"
                  color="var(--crocus-purple)"
                  radius="md"
                  leftSection={<CheckIcon size={20} weight="bold" />}
                  onClick={onCorrect}
                  loading={isSubmitting}
                >
                  Совпало
                </Button>
                <Button
                  size="lg"
                  variant="light"
                  radius="md"
                  color="pink"
                  leftSection={<XIcon size={20} weight="bold" />}
                  onClick={onWrong}
                >
                  Не совпало
                </Button>
              </Group>
            )}

            {gq.is_seen && (
              <Text size="sm" c="dimmed" ta="center">
                На этот вопрос уже дан ответ
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
