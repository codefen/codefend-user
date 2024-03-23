import { formatDate } from '../../../../../../data';
import { EmptyCard, PreferenceIcon, Show } from '../../../../../components';

import { type FC } from 'react';

interface BillingDataProps {
	isLoading: boolean;
	orders: any[];
}

const SettingOrderAndBilling: FC<BillingDataProps> = (props) => {
	return (
		<>
			<div className="card table">
				<div className="header">
					<div className="title">
						<div className="icon">
							<PreferenceIcon />
						</div>
						<span>ORDERS & BILLING DETAILS</span>
					</div>
				</div>

				<div className="columns-name">
					<div className="date">date</div>
					<div className="full-name">order</div>
					<div className="duration">duration</div>
					<div className="price">price</div>
					<div className="price">discount</div>
					<div className="price">final price</div>
					<div className="status">status</div>
				</div>

				<div className="rows">
					<Show when={!props.isLoading}>
						{props.orders.map((order: any) => (
							<div
								key={`pref-order-${crypto.randomUUID()}`}
								className="item">
								<div className="date">
									{formatDate(order?.creacion ?? new Date())}
								</div>
								<div className="full-name">{order.order_desc}</div>
								<div className="duration">{order.order_plazo}</div>
								<div className="price">${order.order_price}</div>
								<div className="price">{order.order_price_disc}%</div>
								<div className="price">${order.order_price_final}</div>
								<div className="status">{order.order_paid}</div>
							</div>
						))}
					</Show>
				</div>
			</div>
			{!props.isLoading && props.orders.length === 0 && <EmptyCard />}
		</>
	);
};

export default SettingOrderAndBilling;
