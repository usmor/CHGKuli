import { Container, Group, Image, Title } from '@mantine/core';
import { clsx } from 'clsx';
import { NavLink } from 'react-router-dom';

import classes from './Header.module.css';

type NavItem = {
  label: string;
  to: string;
};

type HeaderUIProps = {
  title?: string;
  logoSrc?: string;
  navItems?: NavItem[];
};

const defaultNavItems: NavItem[] = [
  { label: 'О проекте', to: '/about' },
  { label: 'Все, что есть', to: '/questions' },
  { label: 'Игра', to: '/game' },
];

export const HeaderUI = ({
  title = 'CHGKuli',
  logoSrc = '/favicon.svg',
  navItems = defaultNavItems,
}: HeaderUIProps): React.JSX.Element => {
  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <NavLink to="/" className={classes.logo}>
          <Image src={logoSrc} alt="Логотип" w={48} h={48} />
          <Title order={1} mb={-4}>
            {title}
          </Title>
        </NavLink>

        <Group gap="lg" component="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(classes.link, { [classes.linkActive]: isActive })
              }
            >
              {item.label}
            </NavLink>
          ))}
        </Group>
      </Container>
    </header>
  );
};
