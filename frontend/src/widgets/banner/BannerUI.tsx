import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

import { Stat } from '@/shared/ui';

import classes from './Banner.module.css';

export const BannerUI = (): React.JSX.Element => {
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
          <Stat value="334 000+" label="вопросов" />
          <Stat value="10 900+" label="авторов" />
          <Stat value="5 500+" label="турниров" />
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
