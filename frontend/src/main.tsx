import App from '@app/index';
import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import { ServerError } from './pages';
import { theme } from './theme';

import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<ServerError />}>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MantineProvider>
    </ErrorBoundary>
  </StrictMode>
);
