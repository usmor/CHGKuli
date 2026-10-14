import { QuestionCard } from '@entities/index';
import { Group, SimpleGrid, Text, Title } from '@mantine/core';
import { CustomAlert, CustomLoader, ScrollToTop, SortButton } from '@shared/ui';
import { FiltersBar } from '@widgets/index';

import type { QuestionFilters } from '@shared/lib/hooks';
import type { Question } from '@shared/types';
import type { RefObject } from 'react';

import classes from './ProfileQuestionsTab.module.css';

type ProfileQuestionsTabUIProps = {
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

export const ProfileQuestionsTabUI = ({
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
}: ProfileQuestionsTabUIProps): React.JSX.Element => {
  return (
    <>
      <div className={classes.layout}>
        <FiltersBar
          filters={filters}
          onApply={onFiltersChange}
          onReset={onFiltersReset}
        />

        <div className={classes.content}>
          <Title order={3}>Пройденные вопросы</Title>

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
                  title="Пока нет пройденных вопросов"
                  message="Поиграйте, и они появятся."
                />
              ) : (
                <>
                  <Group justify="space-between" align="flex-end" wrap="wrap">
                    <Text>Всего пройдено – {total}</Text>
                    <SortButton
                      value={filters.sort}
                      onChange={(sort) => onFiltersChange({ ...filters, sort })}
                    />
                  </Group>

                  <SimpleGrid cols={2}>
                    {questions.map((q) => (
                      <QuestionCard key={q.id} question={q} width={370} />
                    ))}
                  </SimpleGrid>
                </>
              )}

              <div ref={sentinelRef} className={classes.sentinel} />

              {isFetchingNextPage && <CustomLoader />}

              {!hasNextPage && questions.length > 0 && (
                <Text c="dimmed" ta="center" py="xl">
                  Это все пройденные вопросы.
                </Text>
              )}
            </>
          )}
        </div>
      </div>
      <ScrollToTop />
    </>
  );
};
