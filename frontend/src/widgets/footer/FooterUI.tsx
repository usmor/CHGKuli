import { Container, Group, Text } from '@mantine/core';
import { Link } from '@shared/ui/link';

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
          <Link
            href={sourceUrl}
            text="Источник данных"
            target="_blank"
            rel="noopener noreferrer"
            c="var(--purple-haze)"
          />
          <Link
            href={githubUrl}
            text="Исходный код"
            target="_blank"
            rel="noopener noreferrer"
            c="var(--purple-haze)"
          />
        </Group>
        <Link href="#" text="Скорее наверх ↑" c="var(--purple-haze)" />
      </Container>
      <Container className={classes.inner} ta="center" display="block">
        <Text size="xs" c="dimmed">
          Все вопросы принадлежат их авторам. Сайт не претендует на права.
        </Text>
      </Container>
    </footer>
  );
};
