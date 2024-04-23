import EmptyCard from '@defaults/EmptyCard';
import Show from '@defaults/Show';
import { useCurrentOrders } from '@userHooks/providers/useCurrentOrders';
import { useEffect, useState } from 'react';
import { CurrentOrderCard } from '../../components/current-order-card/CurrentOrderCard';
import { useUserData } from '#commonUserHooks/useUserData';
import { ProviderScope } from '@standalones/order-scope/OrderScope';
import ConfirmModal from '@modals/ConfirmModal';

export const CurrentOrderProvider = () => {
	const [currentOrders, { setCurrentOrders, getConfirmOrders }] =
		useCurrentOrders();
	const { getUserdata } = useUserData();
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');
	const removeOrder = (id: string) => {
		setCurrentOrders((prev) => prev.filter((order) => order.id !== id));
	};

	useEffect(() => {
		getConfirmOrders();
	}, []);

	return (
		<>
			<ProviderScope />

			<div className="provider-about">
				{currentOrders.map((order, i) => (
					<CurrentOrderCard
						key={`order-${order.id}${i}`}
						id={order.id}
						finishDate={order.fecha_cierre_calculada}
						offensive={
							order.offensiveness as
								| 'careful'
								| 'offensive'
								| 'adversary'
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
						removeOrder={removeOrder}
						isSelected={active === order.id}
						resourcesScope={JSON.parse(
							order.resources_scope.trim() || '{}',
						)}
					/>
				))}
				<Show when={!Boolean(currentOrders.length)}>
					<EmptyCard
						title="Welcome to the Platform!"
						info="No orders yet, but your profile is being showcased to potential clients. Enhance it for better visibility and attract more clients."
					/>
				</Show>
			</div>
		</>
	);
};
