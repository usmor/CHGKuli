import App from '@app/index';
import { AuthProvider } from '@features/auth';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import { ServerError } from '@pages/index';

import { theme } from './theme';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@styles/index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ErrorBoundary fallback={<ServerError />}>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </MantineProvider>
      </ErrorBoundary>
    </AuthProvider>
  </StrictMode>
);
