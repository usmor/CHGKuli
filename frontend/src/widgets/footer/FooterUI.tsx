import { Anchor, Container, Group, Text } from '@mantine/core';

import classes from './Footer.module.css';

type FooterUIProps = {
  sourceUrl?: string;
  githubUrl?: string;
};

export const FooterUI = ({
  sourceUrl = 'https://db.chgk.info',
  githubUrl = 'https://github.com/usmor/CHGKuli',
}: FooterUIProps): React.JSX.Element => {
  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        <Text>© {new Date().getFullYear()} CHGKuli</Text>
        <Group gap="lg">
          <Anchor
            c="var(--purple-haze)"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Источник данных
          </Anchor>
          <Anchor
            c="var(--purple-haze)"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Исходный код
          </Anchor>
        </Group>
        <Anchor href="#" c="var(--soft-blue)">
          Cкорее наверх ↑
        </Anchor>
      </Container>
      <Container className={classes.inner} ta="center" display="block">
        <Text size="xs" c="dimmed">
          Все вопросы принадлежат их авторам. Сайт не претендует на права.
        </Text>
      </Container>
    </footer>
  );
};
