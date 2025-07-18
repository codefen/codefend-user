import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { ScanSection } from '@/app/views/pages/panel/layouts/scans/ScanSection/ScanSection';
import { ScanTitle } from '@/app/views/pages/panel/layouts/scans/ScanTitle/ScanTitle';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import './scanpage.scss';
import Navbar from '@/app/views/components/navbar/Navbar';
import { SectionTracker } from '@/app/views/components/telemetry/SectionTracker';
import { StatIcon } from '@icons';

export const ScansPage = () => {
  const [showScreen] = useShowScreen();
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const globalStore = useGlobalFastFields([
    'isScanning',
    'company',
    'scanRetries',
    'appEvent',
    'userLoggingState',
  ]);

  useEffect(() => {
    if (
      !globalStore.isScanning.get &&
      globalStore.appEvent.get !== APP_EVENT_TYPE.SCAN_PAGE_CONDITION &&
      globalStore.userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT
    ) {
      globalStore.scanRetries.set(3);
      globalStore.appEvent.set(APP_EVENT_TYPE.SCAN_PAGE_CONDITION);
    }
  }, [globalStore.isScanning, globalStore.appEvent.get]);

  return (
    <SectionTracker sectionName="scans">
      <main className={`scans ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
        <section className="left">
          {/* Cards móviles - se muestran solo en móvil */}
          <div className="mobile-cards">
            {/* Card de bienvenida */}
            <div className="card title">
              <div className="scan-header">
                <h3>
                  <StatIcon />
                  AI Surveillance
                </h3>
                <p>Comprehensive AI-powered security analysis combining automated scans and continuous surveillance of your web applications.</p>
              </div>
            </div>
          </div>

          <ScanSection />

          {/* Badge "Available" - se muestra solo en móvil */}
          <div className="mobile-bottom-card">
            <div className="card remaining-searches black-box">
              Available: {globalStore.company.get.disponibles_neuroscan}
            </div>
          </div>
        </section>
        <section className="right">
          <Navbar />
          <ScanTitle />
          <div className="card remaining-searches black-box">
            Available: {globalStore.company.get.disponibles_neuroscan}
          </div>
        </section>
      </main>
    </SectionTracker>
  );
};
