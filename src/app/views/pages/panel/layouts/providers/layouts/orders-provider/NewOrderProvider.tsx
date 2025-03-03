import { useState, useEffect } from 'react';
import { ConfirmOrderCard } from '../../components/confirm-order-card/ConfirmOrderCard.tsx';
import { useProviderOrders } from '@userHooks/providers/useProviderOrders.ts';
import Show from '@/app/components/Show/Show.tsx';
import EmptyCard from '@/app/components/EmptyCard/EmptyCard.tsx';
import { ProviderOrderRefuseModal } from '../../components/refuse-modal/ProviderOrderRefuseModal.tsx';
import { useProviderRefuseStore } from '@stores/providerOrder.store.ts';
import { ProviderScope } from '@modals/order-scope/OrderScope.tsx';

export const NewOrderProvider = () => {
  const [orders, { setOrders, getProviderOrders }] = useProviderOrders();
  const { refuseState, setRefuseState, orderId } = useProviderRefuseStore();
  const [active, setActiveCard] = useState<string>('');
  const handleActive = (id: string) => setActiveCard(active !== id ? id : '');
  const removeOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  useEffect(() => {
    getProviderOrders();
  }, []);

  useEffect(() => {
    if (refuseState === 2) {
      removeOrder(orderId);
      setRefuseState(0);
    }
  }, [refuseState]);

  return (
    <>
      <ProviderOrderRefuseModal />
      <ProviderScope />
      <div className="provider-about">
        {orders.map((order, i) => (
          <ConfirmOrderCard
            key={`order-${order.id}${i}`}
            id={order.id}
            offensive={order.offensiveness as 'careful' | 'offensive' | 'adversary'}
            price={order.funds_provider}
            type={order.resources_class}
            provider={order?.user_email ? order.user_email : 'unknown'}
            distributor={order.reseller_name || ''}
            scope={order.resources_class === 'full' ? 1 : 0}
            sizeOrder={order.chosen_plan as 'small' | 'medium' | 'full'}
            companyName={order.company_name}
            handleActivate={handleActive}
            removeOrder={removeOrder}
            isSelected={active === order.id}
            resourcesScope={JSON.parse(order.resources_scope.trim() || '{}')}
          />
        ))}
        <Show when={!Boolean(orders.length)}>
          <EmptyCard
            title="Welcome to the Platform!"
            info="No orders yet, but your profile is being showcased to potential clients. Enhance it for better visibility and attract more clients."
          />
        </Show>
      </div>
    </>
  );
};
