import App from '@app/index';
import { AuthProvider } from '@features/auth';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { ServerError } from '@pages/index';

import { theme } from './theme';

import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@styles/index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<ServerError />}>
          <MantineProvider
            defaultColorScheme="light"
            forceColorScheme="light"
            theme={theme}
          >
            <Notifications position="top-right" />
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </MantineProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
