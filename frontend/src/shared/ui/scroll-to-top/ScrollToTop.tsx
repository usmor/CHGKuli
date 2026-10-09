import { Button, Transition } from '@mantine/core';
import { ArrowUpIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import classes from './ScrollToTop.module.css';

const SCROLL_THRESHOLD = 400;

export const ScrollToTop = (): React.JSX.Element => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return (): void => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Transition
      mounted={visible}
      transition="fade"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <div className={classes.wrapper} style={styles}>
          <Button
            onClick={handleClick}
            size="md"
            radius="lg"
            leftSection={<ArrowUpIcon size={20} weight="bold" />}
            className={classes.button}
          >
            Наверх
          </Button>
        </div>
      )}
    </Transition>
  );
};