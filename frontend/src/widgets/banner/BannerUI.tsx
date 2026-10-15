import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { formatStat } from '@shared/lib/utils/';
import { Stat } from '@shared/ui';
import { Link } from 'react-router-dom';

import type { SiteStats } from '@/shared/lib/hooks';

import classes from './Banner.module.css';

type BannerUIProps = {
  stats: SiteStats;
};

export const BannerUI = ({ stats }: BannerUIProps): React.JSX.Element => {
  return (
    <section className={classes.banner}>
      <Stack className={classes.content}>
        <Text className={classes.subtitle}>
          база вопросов &laquo;Что? Где? Когда?&raquo;
        </Text>
        <Title order={1} className={classes.title}>
          CHGKuli
        </Title>
        <Text size="lg">
          Играй. Думай. Отгадывай.
          <br />А еда, молитва и любовь подождут до конца турнира.
        </Text>
        <Group gap="xl" className={classes.stats}>
          <Stat
            value={stats ? formatStat(stats.questions, 1000) : '—'}
            label="вопросов"
          />
          <Stat value={stats ? formatStat(stats.authors, 100) : '—'} label="авторов" />
          <Stat
            value={stats ? formatStat(stats.tournaments, 100) : '—'}
            label="турниров"
          />
        </Group>
        <Group gap="md" mt="md">
          <Button
            component={Link}
            to="/questions"
            size="md"
            color="var(--easter-purple)"
          >
            Смотреть вопросы
          </Button>
          <Button component={Link} to="/game" size="md" color="var(--soft-blue)">
            Начать игру
          </Button>
        </Group>
      </Stack>
      <video
        className={classes.video}
        src="/banner.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    </section>
  );
};
