import { useState, type FC, useEffect } from 'react';
import { ConfirmOrderCard } from '../../components/confirm-order-card/ConfirmOrderCard';
import { useProviderSidebar } from '../../../../../../../data';
import { useParams } from 'react-router';

export const OrdersReviewProviders: FC = () => {
	const { view } = useParams();
	const { activeSubOption, setActiveSubOption } = useProviderSidebar();
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
	});

	if (activeSubOption === 0) {
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
	}

	return undefined;
};
