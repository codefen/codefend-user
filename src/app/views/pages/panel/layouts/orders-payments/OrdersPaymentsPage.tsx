import { useShowScreen } from '#commonHooks/useShowScreen';
import SettingOrderAndBilling from '@/app/views/pages/panel/layouts/preferences/components/SettingOrderAndBilling';
import { useDashboard, usePreferences } from '@panelHooks/index';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart';
import { useNewPreference } from '@panelHooks/preference/usePreferenceNew';
import { ProviderScope } from '@modals/order-scope/OrderScope';
import { OrdersAndPaymentHeaderPage } from '@/app/views/pages/panel/layouts/orders-payments/components/OrdersAndPaymentHeaderPage';
import './orderspayments.scss';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import Navbar from '@/app/views/components/navbar/Navbar';
import { CancelSuscriptionModal } from '@modals/cancel-susceiption/CancelSuscriptionModal';

export const OrdersPaymentsPage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  const { data: preference, isLoading: isLoadingPreference } = useNewPreference();
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.PAYMENT_PAGE_CONDITION);
    }
  }, []);

  useEffect(() => {
    document.title = 'Codefend: orders';
  }, []);

  return (
    <main
      className={`orders-payments ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
      <ProviderScope />
      <CancelSuscriptionModal />
      <section className="left">
        <OrdersAndPaymentHeaderPage />
        <VulnerabilitiesStatus vulnerabilityByShare={dashboardData?.issues_condicion || {}} />
        <SettingOrderAndBilling
          isLoading={isLoadingPreference}
          orders={preference.company_orders}
        />
      </section>
      <section className="right">
        <Navbar />
        <DashboardScanStart />
        <VulnerabilitiesStatus
          isLoading={isLoadingDashboard}
          vulnerabilityByShare={dashboardData?.issues_condicion || {}}
        />
        <VulnerabilityRisk
          vulnerabilityByRisk={dashboardData?.issues_share || {}}
          isLoading={isLoadingDashboard}
        />
      </section>
    </main>
  );
};
