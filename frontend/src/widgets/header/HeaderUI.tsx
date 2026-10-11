import { Button, Container, Group, Image, Menu, Title } from '@mantine/core';
import { SignOutIcon, UserIcon } from '@phosphor-icons/react';
import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import type { User } from '@shared/types/user';

import classes from './Header.module.css';

type NavItem = {
  label: string;
  to: string;
};

type HeaderUIProps = {
  navItems?: NavItem[];
  user?: User | null;
  logout?: () => void;
};

const defaultNavItems: NavItem[] = [
  { label: 'О проекте', to: '/about' },
  { label: 'Все, что есть', to: '/questions' },
  { label: 'Игра', to: '/game' },
];

export const HeaderUI = ({
  user,
  logout,
  navItems = defaultNavItems,
}: HeaderUIProps): React.JSX.Element => {
  const items = user ? navItems : [...navItems, { label: 'Войти', to: '/login' }];
  const location = useLocation();
  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <NavLink to="/" className={classes.logo}>
          <Image src={'/favicon.svg'} alt="Логотип" w={48} h={48} />
          <Title order={1} mb={-4}>
            CHGKuli
          </Title>
        </NavLink>

        <Group gap="lg" component="nav">
          {items.map((item) => (
            <NavLink
              state={item.to === '/login' ? { from: location } : undefined}
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                clsx(classes.link, { [classes.linkActive]: isActive })
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <Menu width={200} position="bottom-end">
              <Menu.Target>
                <Button
                  color="var(--soft-blue)"
                  size="md"
                  radius="md"
                  fz={18}
                  leftSection={<UserIcon size={20} />}
                >
                  {user.username}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item component={NavLink} to="/profile" fz={16}>
                  Личный кабинет
                </Menu.Item>
                <Menu.Item
                  fz={16}
                  rightSection={<SignOutIcon size={16} weight="bold" />}
                  onClick={logout}
                >
                  Выйти
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Container>
    </header>
  );
};
