import type { FC } from 'react';
import { TableV2 } from '../..';
import { useGetScopeTables } from '@hooks/useGetScopeTables';

export interface OrderCloudScopeProps {
	title: string;
	resourceScope: any[];
	scopeALias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n';
}

export const OrderScopeTable: FC<OrderCloudScopeProps> = ({
	title,
	scopeALias,
	resourceScope,
}) => {
	const getDataScopeResourceTable = useGetScopeTables();
	const dataTable = getDataScopeResourceTable(scopeALias, resourceScope);

	return (
		<>
			<h2>{title}</h2>
			<TableV2
				columns={dataTable.columns}
				rowsData={dataTable.rows}
				showRows={true}
				showEmpty={!Boolean(dataTable.rows.length)}
				sizeY={15}
			/>
		</>
	);
};
