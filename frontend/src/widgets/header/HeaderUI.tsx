import {
  ActionIcon,
  Button,
  Container,
  Drawer,
  Group,
  Image,
  Menu,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ListIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react';
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
  const [opened, { toggle, close }] = useDisclosure(false);
  const items = user ? navItems : [...navItems, { label: 'Войти', to: '/login' }];
  const location = useLocation();

  const renderLinks = (isMobile = false): React.JSX.Element => (
    <>
      {items.map((item) => (
        <NavLink
          state={item.to === '/login' ? { from: location } : undefined}
          key={item.to}
          to={item.to}
          end
          onClick={isMobile ? close : undefined}
          className={({ isActive }) =>
            clsx(
              classes.link,
              { [classes.linkActive]: isActive },
              { [classes.mobileLink]: isMobile }
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <NavLink to="/" className={classes.logo}>
          <Image
            src={'/favicon.svg'}
            alt="Логотип"
            w={{ base: 36, sm: 48 }}
            h={{ base: 36, sm: 48 }}
          />
          <Title order={1} mb={-4}>
            CHGKuli
          </Title>
        </NavLink>

        <Group gap="lg" component="nav" className={classes.desktopNav} visibleFrom="md">
          {renderLinks()}
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

        <ActionIcon
          onClick={toggle}
          hiddenFrom="md"
          variant="subtle"
          color="var(--purple-haze)"
          size="lg"
          aria-label="Открыть меню"
          className={classes.burger}
        >
          <ListIcon size={32} weight="bold" />
        </ActionIcon>
      </Container>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xs"
        padding="xl"
        title="Меню"
        styles={{
          content: {
            backgroundСolor: 'rgba(255, 255, 255)',
            borderLeft:
              '10px solid color-mix(in srgb, var(--crocus-purple) 40%, transparent)',
          },
          header: {
            backgroundColor: 'transparent',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            marginBottom: '10px',
          },
          title: {
            fontWeight: 700,
            fontSize: '24px',
            color: 'var(--purple-haze)',
          },
          close: {
            color: 'var(--purple-haze)',
          },
        }}
      >
        <Stack gap="lg">
          {renderLinks(true)}
          {user && (
            <Stack gap="sm">
              <Button
                justify="left"
                component={NavLink}
                to="/profile"
                onClick={close}
                color="var(--soft-blue)"
                radius="md"
                variant="light"
                size="md"
                leftSection={<UserIcon size={20} />}
                fullWidth
                fz="18px"
              >
                Личный кабинет
              </Button>
              <Button
                onClick={() => {
                  logout?.();
                  close();
                }}
                fz="18px"
                justify="left"
                color="pink"
                variant="light"
                radius="md"
                size="md"
                leftSection={<SignOutIcon size={20} />}
                fullWidth
              >
                Выйти
              </Button>
            </Stack>
          )}
        </Stack>
      </Drawer>
    </header>
  );
};
