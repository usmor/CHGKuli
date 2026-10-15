import { Button, Container, Group, Text, Title } from '@mantine/core';

import { Seo } from '@/shared/ui';

import classes from './ServerError.module.css';

export const ServerError = (): React.JSX.Element => {
  const handleRefresh = (): void => {
    window.location.reload();
  };
  return (
    <>
      <Seo title="Ошибка сервера" noIndex />
      <Container className={classes.root}>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Что-то пошло не так</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Знатоки в студии совещаются, как обработать ваш запрос. Обычно это занимает
          пару секунд — попробуйте обновить страницу.
        </Text>
        <Group justify="center">
          <Button color="var(--easter-purple)" size="md" onClick={handleRefresh}>
            Обновить страницу
          </Button>
        </Group>
      </Container>
    </>
  );
};
