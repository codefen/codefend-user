import EmptyCard from '@defaults/EmptyCard.tsx';
import Show from '@defaults/Show.tsx';
import { useProviderOrderFinished } from '@userHooks/providers/useProviderOrderFinished';
import { useEffect, useState } from 'react';
import { FinishOrderCard } from '../../components/finished-order-card/FinishedOrderCard';
import { useUserData } from '#commonUserHooks/useUserData';

export const FinishOrderProvider = () => {
	const [finishedOrders, { getFinishedOrders, isLoading }] =
		useProviderOrderFinished();
	const { getUserdata } = useUserData();
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');

	useEffect(() => {
		getFinishedOrders();
	}, []);

	return (
		<div className="provider-about">
			{finishedOrders.current.map((order, i) => (
				<FinishOrderCard
					key={`order-${order.id}${i}`}
					id={order.id}
					finishDate={order.fecha_cierre_calculada}
					offensive={
						order.offensiveness as 'careful' | 'offensive' | 'adversary'
					}
					price={order.funds_provider}
					type={order.resources_class}
					provider={
						getUserdata().id == order?.provider_id
							? getUserdata().username || 'unknown'
							: 'unknown'
					}
					distributor={order.reseller_name || ''}
					scope={order.resources_class === 'full' ? 1 : 0}
					sizeOrder={order.chosen_plan as 'small' | 'medium' | 'full'}
					handleActivate={handleActive}
					isSelected={active === order.id}
					resourcesScope={JSON.parse(order.resources_scope.trim() || '{}')}
				/>
			))}
			<Show when={!Boolean(finishedOrders.current.length)}>
				<EmptyCard
					title="Welcome to the Platform!"
					info="No orders yet, but your profile is being showcased to potential clients. Enhance it for better visibility and attract more clients."
				/>
			</Show>
		</div>
	);
};
