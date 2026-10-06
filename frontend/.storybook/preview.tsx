import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';

import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/styles/index.css';

const withProviders: Decorator = (Story) => (
  <MantineProvider defaultColorScheme="light">
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  </MantineProvider>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [withProviders],
};

export default preview;
