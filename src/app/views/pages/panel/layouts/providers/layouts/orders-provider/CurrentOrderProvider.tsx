import EmptyCard from '@defaults/EmptyCard';
import Show from '@defaults/Show';
import { useCurrentOrders } from '@userHooks/providers/useCurrentOrders';
import { useEffect, useState } from 'react';
import { CurrentOrderCard } from '../../components/current-order-card/CurrentOrderCard';
import { useUserData } from '#commonUserHooks/useAuthState';

export const CurrentOrderProvider = () => {
	const [currentOrders, { getConfirmOrders, isLoading }] = useCurrentOrders();
	const { getUserdata } = useUserData();
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');
	const removeOrder = (id: string) => {
		currentOrders.current = currentOrders.current.filter(
			(order) => order.id !== id,
		);
	};

	useEffect(() => {
		getConfirmOrders();
	}, []);

	return (
		<div className="provider-about">
			{currentOrders.current.map((order, i) => (
				<CurrentOrderCard
					key={`order-${order.id}${i}`}
					id={order.id}
					offensive={
						order.offensiveness as 'careful' | 'offensive' | 'adversary'
					}
					price={order.funds_provider}
					type={order.resources_class}
					provider={
						getUserdata()?.id == order?.provider_id
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
			<Show when={!Boolean(currentOrders.current.length)}>
				<EmptyCard
					title="Welcome to the Platform!"
					info="No orders yet, but your profile is being showcased to potential clients. Enhance it for better visibility and attract more clients."
				/>
			</Show>
		</div>
	);
};
