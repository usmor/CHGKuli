import {
  Badge,
  Button,
  Card,
  CopyButton,
  Group,
  Stack,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import {
  ProfileInfoTab,
  ProfileStatsTab,
  ProfileQuestionsTab,
  ProfileGamesTab,
} from '@widgets/index';
import { useSearchParams } from 'react-router-dom';

import { CustomAlert, CustomLoader, Seo } from '@/shared/ui';

import type { DailyCodeResponse } from '@shared/lib/hooks';
import type { User } from '@shared/types/user';
import type { UseQueryResult } from '@tanstack/react-query';

import classes from './Profile.module.css';

type ProfileUIProps = {
  user: User;
  dailyCodeQuery: UseQueryResult<DailyCodeResponse, Error>;
};

export const ProfileUI = ({
  user,
  dailyCodeQuery,
}: ProfileUIProps): React.JSX.Element => {
  const { data, isLoading, isError } = dailyCodeQuery;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'info';

  const handleTabChange = (value: string | null): void => {
    if (!value) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', value);
        return next;
      },
      { replace: true }
    );
  };
  return (
    <>
      <Seo title="Личный кабинет" noIndex />
      <Stack maw={1100} mx="auto" mb="xl" gap="lg" w="100%">
        <Card withBorder padding="xl">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
            <Stack gap={4}>
              <Title order={2}>Личный кабинет</Title>
              <Text fz={16} c="var(--purple-haze)" fw={500}>
                {user.username} · {user.email}
              </Text>
            </Stack>

            <Stack gap="xs" align="flex-end">
              <Text fw={600} fz={20}>
                Личный код на сегодня
              </Text>

              {isLoading && <CustomLoader />}

              {isError && (
                <CustomAlert
                  title="Не удалось загрузить код"
                  message="Попробуйте обновить страницу позже."
                />
              )}

              {data && (
                <Group gap="sm" align="center" wrap="nowrap">
                  <Badge
                    size="xl"
                    variant="light"
                    color="var(--crocus-purple)"
                    radius="md"
                    styles={{
                      label: {
                        fontSize: 22,
                        letterSpacing: 3,
                        fontWeight: 700,
                        paddingLeft: 4,
                        paddingRight: 4,
                      },
                      root: {
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    {data.daily_code}
                  </Badge>

                  <CopyButton value={data.daily_code} timeout={2000}>
                    {({ copied, copy }) => (
                      <Button
                        size="md"
                        radius="md"
                        variant={copied ? 'filled' : 'light'}
                        color="var(--soft-blue)"
                        onClick={copy}
                        leftSection={
                          copied ? (
                            <CheckIcon size={18} weight="bold" />
                          ) : (
                            <CopyIcon size={18} />
                          )
                        }
                        styles={{ root: { height: 44 } }}
                      >
                        {copied ? 'Скопировано' : 'Копировать'}
                      </Button>
                    )}
                  </CopyButton>
                </Group>
              )}

              <Text fz={14} c="dimmed" ta="right" maw={480}>
                Поделись кодом с организатором игры. Код действует до конца дня.
              </Text>
            </Stack>
          </Group>
        </Card>

        <Tabs
          className={classes.tabs}
          defaultValue="info"
          variant="outline"
          classNames={{
            tab: classes.tab,
            tabLabel: classes.tabLabel,
          }}
          value={activeTab}
          onChange={handleTabChange}
        >
          <Tabs.List className={classes.tabsList}>
            <Tabs.Tab value="info">Профиль</Tabs.Tab>
            <Tabs.Tab value="stats">Статистика</Tabs.Tab>
            <Tabs.Tab value="questions">Пройденные вопросы</Tabs.Tab>
            <Tabs.Tab value="games">История игр</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info" pt="lg">
            <ProfileInfoTab user={user} />
          </Tabs.Panel>

          <Tabs.Panel value="stats" pt="lg">
            <ProfileStatsTab />
          </Tabs.Panel>

          <Tabs.Panel value="questions" pt="lg">
            <ProfileQuestionsTab />
          </Tabs.Panel>

          <Tabs.Panel value="games" pt="lg">
            <ProfileGamesTab />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </>
  );
};
