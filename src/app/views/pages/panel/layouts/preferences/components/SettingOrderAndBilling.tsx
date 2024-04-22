import { useEffect, useState, type FC } from 'react';
import { PreferenceIcon } from '@icons';
import Show from '@defaults/Show.tsx';
import EmptyCard from '@defaults/EmptyCard.tsx';
import { SimpleSection } from '@defaults/SimpleSection';
import type { CompanyOrders } from '@interfaces/preferences';
import { UserOrderCard } from './UserOrderCard';
import { useUserData } from '#commonUserHooks/useUserData';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';

interface BillingDataProps {
	isLoading: boolean;
	orders: CompanyOrders[];
}

const SettingOrderAndBilling: FC<BillingDataProps> = ({
	orders,
	isLoading,
}) => {
	const [active, setActiveCard] = useState<string>('');
	const handleActive = (id: string) => setActiveCard(active !== id ? id : '');

	return (
		<>
			<div className="card orders-preference-card">
				<SimpleSection
					header="ORDERS & BILLING DETAILS"
					icon={<PreferenceIcon />}>
					<div className="order-preference-content">
						<Show when={Boolean(orders.length)} fallback={<EmptyCard />}>
							{orders.map((order, i) => (
								<UserOrderCard
									key={`order-${order.id}${i}`}
									id={order.id}
									offensive={
										order.offensiveness as
											| 'careful'
											| 'offensive'
											| 'adversary'
									}
									price={order.funds_full}
									type={order.resources_class}
									provider={order.provider_username}
									scope={order.resources_class === 'full' ? 1 : 0}
									sizeOrder={
										order.chosen_plan as 'small' | 'medium' | 'full'
									}
									handleActivate={handleActive}
									isSelected={active === order.id}
									resourcesScope={JSON.parse(
										order.resources_scope.trim() || '{}',
									)}
									conditionFinancial={order.condicion_financial}
									conditionProvider={order.condicion_provider}
									conditionReview={order.condicion_review}
									referenceNumber={order.reference_number}
								/>
							))}
						</Show>
					</div>
				</SimpleSection>
			</div>
		</>
	);
};

export default SettingOrderAndBilling;
