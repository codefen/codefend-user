import { useShowScreen } from '#commonHooks/useShowScreen';
import SettingOrderAndBilling from '@/app/views/pages/panel/layouts/preferences/components/SettingOrderAndBilling';
import { usePreferences } from '@panelHooks/index';
import './orderspayments.scss';
import { PrimaryButton } from '@buttons/index';

export const OrdersPaymentsPage = () => {
  const [showScreen, _, refresh] = useShowScreen();
  const { orders, company, members, isLoading, refetch } = usePreferences();

  return (
    <main className={`orders-payments ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <div className="card">
          <div className="over">
            <div className="table-title">
              <img
                src={'/codefend/coin-payments.png'}
                alt="orders-payments"
                width={200}
                height={200}
                decoding="async"
              />
              <div className="table-title-info">
                <h2>Orders and payments</h2>
                <p>View and manage your purchase orders. Buy new plans for your company.</p>
                <PrimaryButton text="Make a new purchase" buttonStyle="red" />
              </div>
            </div>
          </div>
        </div>
        <SettingOrderAndBilling isLoading={isLoading} orders={orders || []} />
      </section>
      <section className="right"></section>
    </main>
  );
};
