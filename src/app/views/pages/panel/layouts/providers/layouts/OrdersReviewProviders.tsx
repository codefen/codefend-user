import type { FC } from 'react';
import { ConfirmOrderCard } from '../components/confirm-order-card/ConfirmOrderCard';

export const OrdersReviewProviders: FC = () => {
	return (
		<div className="provider-about">
			<ConfirmOrderCard
				offensive="careful"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={0}
				sizeOrder="medium"
				type="web"
			/>
			<ConfirmOrderCard
				offensive="careful"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={0}
				sizeOrder="medium"
				type="web"
			/>
			<ConfirmOrderCard
				offensive="careful"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={0}
				sizeOrder="medium"
				type="web"
			/>
			<ConfirmOrderCard
				offensive="careful"
				distributor="Al bilad"
				provider="eddkrauser"
				scope={0}
				sizeOrder="medium"
				type="web"
			/>
		</div>
	);
};
