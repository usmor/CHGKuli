import { Container, Group, Text, UnstyledButton } from '@mantine/core';
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
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.topRow}>
        <Text>© {new Date().getFullYear()} CHGKuli</Text>
        <Group gap="lg" className={classes.linksGroup}>
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

        <UnstyledButton onClick={scrollToTop} className={classes.scrollButton}>
          <Text c="var(--purple-haze)" fw={500}>
            Скорее наверх ↑
          </Text>
        </UnstyledButton>
      </Container>

      <Container size="lg" className={classes.bottomRow}>
        <Text size="xs" c="dimmed" ta="center">
          Все вопросы принадлежат их авторам. Сайт не претендует на права.
        </Text>
      </Container>
    </footer>
  );
};
