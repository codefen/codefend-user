import { SimpleSection } from '@defaults/SimpleSection';
import { GlobeWebIcon } from '@icons';
import {
	resellerCompanyColumns,
	resellerOrdersColumn,
	resellerUserActiveColumns,
} from '@mocks/defaultData';
import { LocationItem } from '@standalones/index';
import { TableV2 } from '@table/tablev2';
import type { FC } from 'react';
import type { Company } from '@interfaces/company';
import type { FullOrder } from '@interfaces/order';
import { formatDate } from '@utils/helper';

interface ResellerAllOrdersProps {
	orders: FullOrder[];
	isLoading: boolean;
}

export const ResellerAllOrders: FC<ResellerAllOrdersProps> = ({
	orders,
	isLoading,
}) => {
	const dataTable = orders.map(
		(order: FullOrder) =>
			({
				ID: { value: '', style: '' },
				area: {
					value: (
						<LocationItem
							country={order.user_pais || 'unknown'}
							countryCode={order.user_pais_code}
						/>
					),
					style: 'area',
				},
				company: { value: order.company_id, style: 'id' },
				plan: { value: order.chosen_plan, style: 'plan' },
				provider: {
					value: order.provider_id,
					style: 'id',
				},
				resellerFunds: { value: order.funds_reseller, style: 'funds' },
				codefendFunds: { value: order.funds_codefend, style: 'funds' },
				providerFunds: { value: order.funds_provider, style: 'funds' },

				orderState: { value: order.condicion_provider, style: 'state' },
				finish: {
					value: order.fecha_cierre_real
						? formatDate(order.fecha_cierre_real)
						: '---',
					style: 'date',
				},
				published: { value: order.creacion, style: 'date' },
			}) as any,
	);

	return (
		<div className="card">
			<SimpleSection header="Listing all orders" icon={<GlobeWebIcon />}>
				<div className="">
					<TableV2
						columns={resellerOrdersColumn}
						rowsData={dataTable}
						showEmpty={!isLoading && !Boolean(dataTable.length)}
						showRows={!isLoading}
					/>
				</div>
			</SimpleSection>
		</div>
	);
};
