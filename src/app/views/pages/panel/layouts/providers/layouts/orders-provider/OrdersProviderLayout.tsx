import { useState, type FC, useEffect } from 'react';
import { useParams } from 'react-router';
import { ConfirmOrderCard } from '../../components/confirm-order-card/ConfirmOrderCard.tsx';
import { useProviderSidebar } from '@userHooks/providers/useProviderSidebar.ts';
import { useProviderOrders } from '@userHooks/providers/useProviderOrders.ts';

export const OrdersReviewProviders: FC = () => {
	const { view } = useParams();
	const { activeSubOption, setActiveSubOption } = useProviderSidebar();
	const [orders, { getProviderOrders }] = useProviderOrders();
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');
	useEffect(() => {
		if (view) {
			if (view.startsWith('new')) {
				setActiveSubOption(0);
			}
			if (view.startsWith('finish')) {
				setActiveSubOption(1);
			}
		}
		getProviderOrders();
	}, []);

	if (activeSubOption === 0) {
		return (
			<div className="provider-about">
				{orders.current.map((order) => (
					<ConfirmOrderCard
						offensive={order.offensive}
						distributor={order.distributor}
						provider={order.provider}
						scope={order.scope}
						sizeOrder={order.sizeOrder}
						type={order.type}
						price={order.price}
						handleActivate={handleActive}
						id={order.id}
						isSelected={active === order.id}
					/>
				))}
			</div>
		);
	}

	return undefined;
};
