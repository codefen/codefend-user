import type { FC } from 'react';
import { TableV2 } from '../..';
import { useGetScopeTables } from '@hooks/useGetScopeTables';
import { useCopyToClipboard } from '#commonHooks/useCopyToClipboard';
import { toast } from 'react-toastify';

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
	const [copyToClipboard, {}] = useCopyToClipboard();
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
				selectItem={(id: any) => {
					if (id && scopeALias === 'm') {
						const link: string =
							resourceScope.find((resource) => resource.id === id)
								?.app_link || '';
						copyToClipboard(link);
						toast.success('You copied the link');
					}
					if (id && scopeALias === 'sc') {
						const link: string =
							resourceScope.find((resource) => resource.id === id)
								?.access_link || '';
						copyToClipboard(link);
						toast.success('You copied the link');
					}
					if (id && scopeALias === 'w') {
						const domain: string =
							(
								resourceScope.find((resource) => resource.id === id) ||
								resourceScope
									.flatMap((resource) => resource.childs)
									.find((child) => child.id === id)
							)?.resource_domain || '';

						copyToClipboard(domain);
						toast.success('You copied the web domain');
					}
				}}
			/>
		</>
	);
};
