import { QuestionCard } from '@entities/index';
import { Container, Title, Text, SimpleGrid, Group } from '@mantine/core';
import { CustomAlert, CustomLoader, ScrollToTop, SortButton } from '@shared/ui';
import { FiltersBar } from '@widgets/index';

import type { QuestionFilters } from '@shared/lib/hooks';
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
  filters: QuestionFilters;
  onFiltersChange: (filters: QuestionFilters) => void;
  onFiltersReset: () => void;
};

export const AllQuestionsUI = ({
  questions,
  total,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  error,
  sentinelRef,
  filters,
  onFiltersChange,
  onFiltersReset,
}: AllQuestionsUIProps): React.JSX.Element => {
  return (
    <>
      <Container size="xl" py="xl">
        <div className={classes.layout}>
          <FiltersBar
            filters={filters}
            onApply={onFiltersChange}
            onReset={onFiltersReset}
          />

          <div className={classes.content}>
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
                  <CustomAlert
                    title="Пока ничего нет"
                    message="Попробуйте другой запрос"
                  />
                ) : (
                  <>
                    <Group justify="space-between" align="flex-end" wrap="wrap">
                      <Text>Всего загружено вопросов – {total} </Text>
                      <SortButton
                        value={filters.sort}
                        onChange={(sort) => onFiltersChange({ ...filters, sort })}
                      />
                    </Group>
                    <SimpleGrid cols={2}>
                      {questions.map((q) => (
                        <QuestionCard key={q.id} question={q} />
                      ))}
                    </SimpleGrid>
                  </>
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
          </div>
        </div>
      </Container>
      <ScrollToTop />
    </>
  );
};
