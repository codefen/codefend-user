import { useState, type FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { ConfirmOrderCard } from '../../components/confirm-order-card/ConfirmOrderCard.tsx';
import { useProviderSidebar } from '@userHooks/providers/useProviderSidebar.ts';
import { useProviderOrders } from '@userHooks/providers/useProviderOrders.ts';
import { useUserData } from '#commonUserHooks/useAuthState.ts';
import Show from '@defaults/Show.tsx';
import EmptyCard from '@defaults/EmptyCard.tsx';
import { ProviderOrderRefuseModal } from '../../components/refuse-modal/ProviderOrderRefuseModal.tsx';
import { useProviderRefuseStore } from '@stores/providerOrder.store.ts';

export const NewOrderProvider = () => {
	const { getUserdata } = useUserData();
	const [orders, { getProviderOrders }] = useProviderOrders();
	const { refuseState, setRefuseState, orderId } = useProviderRefuseStore();
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');
	const removeOrder = (id: string) => {
		orders.current = orders.current.filter((order) => order.id !== id);
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
			<div className="provider-about">
				{orders.current.map((order, i) => (
					<ConfirmOrderCard
						key={`order-${order.id}${i}`}
						id={order.id}
						offensive={
							order.offensiveness as
								| 'careful'
								| 'offensive'
								| 'adversary'
						}
						price={order.funds_provider}
						type={order.resources_class}
						provider={
							getUserdata().id == order.provider_id
								? getUserdata().username || 'unknown'
								: 'unknown'
						}
						distributor={order.reseller_name || ''}
						scope={order.resources_class === 'full' ? 1 : 0}
						sizeOrder={order.chosen_plan as 'small' | 'medium' | 'full'}
						handleActivate={handleActive}
						removeOrder={removeOrder}
						isSelected={active === order.id}
					/>
				))}
				<Show when={!Boolean(orders.current.length)}>
					<EmptyCard
						title="Welcome to the Platform!"
						info="No orders yet, but your profile is being showcased to potential clients. Enhance it for better visibility and attract more clients."
					/>
				</Show>
			</div>
		</>
	);
};
