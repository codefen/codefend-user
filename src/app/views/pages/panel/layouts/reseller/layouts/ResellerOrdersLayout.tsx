import { useShowScreen } from '#commonHooks/useShowScreen';
import { useEffect } from 'react';
import { ResellerHeader } from '../components/ResellerHeader';
import '../reseller.scss';
import { ResourceByLocation } from '@standalones/ResourceByLocation';
import { useResellerOrders } from '@userHooks/resellers/useResellerOrders';
import { ResellerAllOrders } from '../components/ResellerAllOrders';

const ResellerOrdersLayout = () => {
	const [showScreen] = useShowScreen();

	const [orders, { getResellerOrders, isLoading }] = useResellerOrders();

	useEffect(() => {
		getResellerOrders();
	}, []);

	return (
		<main className={`reseller ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ResellerHeader />
				<div></div>
				<div className="reseller-tables table-orders">
					<ResellerAllOrders
						isLoading={isLoading}
						orders={orders.current}
					/>
				</div>
			</section>
			<section className="right">
				<ResourceByLocation
					resource={[]}
					isLoading={isLoading}
					type="g"
					title="Orders by location"
				/>
			</section>
		</main>
	);
};
export default ResellerOrdersLayout;
