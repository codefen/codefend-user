import { useState, type FC } from 'react';
import { ConfirmOrderCard } from '../components/confirm-order-card/ConfirmOrderCard';

export const OrdersReviewProviders: FC = () => {
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');

	return (
		<div className="provider-about">
			<ConfirmOrderCard
				offensive="careful"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={1}
				sizeOrder="full"
				type="web"
				price="4.500"
				handleActivate={handleActive}
				id="1"
				isSelected={active === '1'}
			/>
			<ConfirmOrderCard
				offensive="offensive"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={1}
				sizeOrder="medium"
				type="mobile"
				price="1.500"
				handleActivate={handleActive}
				id="2"
				isSelected={active === '2'}
			/>
			<ConfirmOrderCard
				offensive="adversary"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={0}
				sizeOrder="small"
				type="full"
				price="450"
				handleActivate={handleActive}
				id="3"
				isSelected={active === '3'}
			/>
		</div>
	);
};
