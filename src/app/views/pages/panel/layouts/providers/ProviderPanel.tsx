import { Suspense, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar.tsx';
import { ProviderList } from './components/ProviderList.tsx';
import { ProviderHeader } from './components/ProviderHeader.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './provider.scss';
import { useProviderCompanies } from '@userHooks/providers/useProviderCompanies.ts';

const ProviderPage = () => {
  const [showScreen] = useShowScreen();
  return (
    <main className={`provider ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ProviderHeader />
        <div className="provider-content">
          <ProviderSidebar />
          <div className="provider-main-content">
            <Suspense>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProviderPage;
