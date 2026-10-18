import { Badge, Card, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

import type { Question } from '@shared/types';

import classes from './QuestionCard.module.css';

type QuestionCardUIProps = {
  question: Question;
  previewLength?: number;
  badge?: React.ReactNode;
  width: number;
};

const PLACEHOLDER = '—';

export const QuestionCardUI = ({
  question,
  previewLength = 150,
  badge,
  width = 400,
}: QuestionCardUIProps): React.JSX.Element => {
  const preview =
    question.question_text.length > previewLength
      ? `${question.question_text.slice(0, previewLength)}…`
      : question.question_text;

  const authors = question.authors.map((a) => a.name).join(', ');
  const tournament = question.tournament;
  const tournamentName = tournament?.name ?? PLACEHOLDER;
  const tournamentYear = tournament?.year ?? PLACEHOLDER;

  return (
    <Card
      component={Link}
      to={`/questions/${question.id}`}
      className={classes.card}
      radius="md"
      withBorder
      w={width}
    >
      <Group justify="space-between" wrap="nowrap" gap="sm" className={classes.head}>
        <Text size="sm" c="dimmed" className={classes.tournament} truncate>
          {tournamentName}
        </Text>
        {badge}
        <Badge color="var(--easter-purple)" className={classes.badge} radius="md">
          {tournamentYear}
        </Badge>
      </Group>

      <Text className={classes.text}>{preview}</Text>

      <Text size="sm" c="dimmed" className={classes.authors} truncate>
        {authors || PLACEHOLDER}
      </Text>
    </Card>
  );
};
