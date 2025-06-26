import { Suspense } from 'react';

import { ErrorBoundary } from './views/components/ErrorBoundry/ErrorBoundry';
import { AppRouter } from './router/Routes';
import { Loader } from '@/app/views/components/loaders/Loader';
import { GlobalStoreProvider } from '@/app/views/context/AppContextProvider';
import { AppWrapper } from '@/app/views/AppWrapper';

export const App = () => (
  <GlobalStoreProvider>
    <ErrorBoundary>
      <AppWrapper>
        <Suspense fallback={<Loader />}>
          <AppRouter />
        </Suspense>
      </AppWrapper>
    </ErrorBoundary>
  </GlobalStoreProvider>
);
