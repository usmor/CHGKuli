import { QuestionCard } from '@entities/index';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
} from '@mantine/core';
import { CustomAlert, CustomLoader, ScrollToTop } from '@shared/ui';

import type { Question } from '@shared/types';
import type { RefObject } from 'react';

import classes from './AllQuestions.module.css';

type AllQuestionsUIProps = {
  questions: Question[];
  total: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error: Error | null;
  sentinelRef: RefObject<HTMLDivElement | null>;
};

export const AllQuestionsUI = ({
  questions,
  total,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  error,
  sentinelRef,
}: AllQuestionsUIProps): React.JSX.Element => {
  return (
    <>
      <Container size="xl" py="xl" className={classes.content}>
        <Title order={1}>Все, что есть</Title>
        {isLoading && <CustomLoader />}

        {error && (
          <CustomAlert
            title="Не удалось загрузить вопросы"
            message="Попробуйте обновить страницу позже."
          />
        )}

        {!isLoading && !error && (
          <>
            {questions.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                Пока ничего нет
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                {questions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </SimpleGrid>
            )}

            <div ref={sentinelRef} className={classes.sentinel} />

            {isFetchingNextPage && <CustomLoader />}

            {!hasNextPage && questions.length > 0 && (
              <Text c="dimmed" ta="center" py="xl">
                Это все вопросы. Дальше ничего нет.
              </Text>
            )}
          </>
        )}
      </Container>
      <ScrollToTop />
    </>
  );
};
