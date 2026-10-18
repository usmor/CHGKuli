import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

import { Seo } from '@/shared/ui';

import classes from './NotFound.module.css';

export const NotFound = (): React.JSX.Element => {
  return (
    <>
      <Seo title="Страница не найдена" noIndex />
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>Страница не найдена</Title>
        <Text size="lg" ta="center" className={classes.description}>
          И это единственный вопрос, на который у нас нет ответа. Все остальные можно
          найти на главной странице.
        </Text>
        <Group justify="center">
          <Button color="var(--easter-purple)" size="md" component={Link} to="/">
            Вернуться на главную
          </Button>
        </Group>
      </Container>
    </>
  );
};
