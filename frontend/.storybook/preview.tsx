import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mswLoader } from 'msw-storybook-addon/csf3';
import { MemoryRouter } from 'react-router-dom';

import { theme } from '@/theme';

import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});


const withProviders: Decorator = (Story) => (
  <QueryClientProvider client={queryClient}>
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    </MantineProvider>
  </QueryClientProvider>
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
  loaders: [mswLoader()],
};

export default preview;
