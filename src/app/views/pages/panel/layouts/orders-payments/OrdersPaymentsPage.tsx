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
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';

export const OrdersPaymentsPage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  const { data: preference, isLoading: isLoadingPreference } = useNewPreference();
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard();
  const { appEvent } = useGlobalFastFields(['appEvent']);

  useEffect(() => {
    if (appEvent.get !== APP_EVENT_TYPE.USER_LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.PAYMENT_PAGE_CONDITION);
    }
  }, [appEvent.get]);

  return (
    <main className={`orders-payments ${showScreen ? 'actived' : ''}`}>
      <ProviderScope />
      <section className="left">
        <OrdersAndPaymentHeaderPage />
        <SettingOrderAndBilling
          isLoading={isLoadingPreference}
          orders={preference.company_orders}
        />
      </section>
      <section className="right">
        <VulnerabilitiesStatus vulnerabilityByShare={dashboardData?.issues_condicion || {}} />
        <VulnerabilityRisk
          vulnerabilityByRisk={dashboardData?.issues_share || {}}
          isLoading={isLoadingDashboard}
        />
        <DashboardScanStart />
      </section>
    </main>
  );
};
