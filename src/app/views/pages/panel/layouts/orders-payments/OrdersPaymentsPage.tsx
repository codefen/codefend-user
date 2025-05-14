import { useShowScreen } from '#commonHooks/useShowScreen';
import SettingOrderAndBilling from '@/app/views/pages/panel/layouts/preferences/components/SettingOrderAndBilling';
import { useDashboard, usePreferences } from '@panelHooks/index';
import './orderspayments.scss';
import { PrimaryButton } from '@buttons/index';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart';
import { useNewPreference } from '@panelHooks/preference/usePreferenceNew';
import { ProviderScope } from '@modals/order-scope/OrderScope';

export const OrdersPaymentsPage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  const { data: preference, isLoading: isLoadingPreference } = useNewPreference();
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboard();

  return (
    <main className={`orders-payments ${showScreen ? 'actived' : ''}`}>
      <ProviderScope />
      <section className="left">
        <div className="card rectangle">
          <div className="over">
            <img
              src="/codefend/coin-payments.png"
              alt="orders-payments"
              width={200}
              height={200}
              decoding="async"
            />
            <div className="header-content">
              <h2>Orders and payments</h2>
              <p>View and manage your purchase orders. Buy new plans for your company.</p>
              <PrimaryButton text="Make a new purchase" buttonStyle="red" />
            </div>
          </div>
        </div>
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
