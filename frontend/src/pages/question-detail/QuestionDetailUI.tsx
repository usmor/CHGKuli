import {
  Accordion,
  Anchor,
  Badge,
  Button,
  CheckIcon,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { CustomAlert, CustomLoader } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

import type { Question } from '@/shared/types';

import classes from './QuestionDetail.module.css';

type QuestionDetailUIProps = {
  question: Question;
  isPassed: boolean;
  onTogglePassed: () => void;
};

export const QuestionDetailUI = {
  Question: ({
    question,
    isPassed,
    onTogglePassed,
  }: QuestionDetailUIProps): React.JSX.Element => {
    const authors = question.authors.map((a) => a.name).join(', ');
    const tournament = question.tournament;
    const navigate = useNavigate();

    return (
      <div className={classes.root}>
        <Stack gap="lg" className={classes.inner}>
          <Anchor
            component="button"
            c="var(--purple-haze)"
            className={classes.backButton}
            onClick={() => void navigate(-1)}
          >
            ← Скорее назад
          </Anchor>

          <Group gap="md" wrap="nowrap">
            {tournament?.name && (
              <Text className={classes.tournament} truncate>
                {tournament?.name}
              </Text>
            )}
            {isPassed && (
              <Badge
                color="var(--crocus-purple)"
                variant="filled"
                fz={12}
                radius="md"
                size="lg"
                leftSection={<CheckIcon size={12} />}
              >
                Вопрос пройден
              </Badge>
            )}

            {tournament?.year && (
              <Badge color="var(--easter-purple)" size="lg" radius="md">
                {tournament?.year}
              </Badge>
            )}
          </Group>

          <Text className={classes.question} size="24px">
            {question.question_text}
          </Text>

          <Accordion variant="separated" order={3}>
            {question.answer && (
              <Accordion.Item key="answer" value="answer">
                <Accordion.Control icon={'✅'}>Ответ</Accordion.Control>
                <Accordion.Panel>{question.answer}</Accordion.Panel>
              </Accordion.Item>
            )}
            {question.pass_criteria && (
              <Accordion.Item key="pass_criteria" value="pass_criteria">
                <Accordion.Control icon={'📏'}>Критерии зачёта</Accordion.Control>
                <Accordion.Panel>{question.pass_criteria}</Accordion.Panel>
              </Accordion.Item>
            )}
            {question.comment && (
              <Accordion.Item key="comment" value="comment">
                <Accordion.Control icon={'💬'}>Комментарий</Accordion.Control>
                <Accordion.Panel>
                  <div className={classes.comment}>{question.comment}</div>
                </Accordion.Panel>
              </Accordion.Item>
            )}
          </Accordion>

          <Stack gap="xs">
            <Text c="dimmed">
              Автор{authors.includes(',') ? 'ы' : ''}: {authors || '—'}
            </Text>
            {tournament && (
              <Text c="dimmed">
                Турнир: {tournament.name} {tournament.year && ` (${tournament.year})`}
              </Text>
            )}
          </Stack>
          <Button
            onClick={onTogglePassed}
            variant="filled"
            color={isPassed ? 'var(--purple-haze)' : 'var(--soft-blue)'}
            fz={16}
            leftSection={isPassed ? <CheckIcon size={16} /> : null}
          >
            {isPassed ? 'Снять отметку' : 'Пометить вопрос как пройденный'}
          </Button>
        </Stack>
      </div>
    );
  },

  Loading: (): React.JSX.Element => <CustomLoader />,

  Error: (): React.JSX.Element => (
    <CustomAlert
      title="Не удалось загрузить вопрос"
      message="Попробуйте обновить страницу позже."
    />
  ),
};
