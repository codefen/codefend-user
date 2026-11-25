import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar.tsx';
import { ProviderHeader } from './components/ProviderHeader.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './provider.scss';

const ProviderPage = () => {
  const [showScreen] = useShowScreen();
  return (
    <PanelInterior title="Provider workspace" ready={showScreen} className="provider">
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
    </PanelInterior>
  );
};

export default ProviderPage;
