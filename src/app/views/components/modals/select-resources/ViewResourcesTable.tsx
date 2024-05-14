import { useEffect, useRef, useState, type FC } from 'react';
import { useGetScopeTables } from '@hooks/useGetScopeTables';
import { TableV2 } from '@table/tablev2';
import { useGetResources } from '@resourcesHooks/useGetResources';

export interface OrderCloudScopeProps {
	type: string;
	scopeALias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n';
	handleSelect: (id: string, type: string, count: number) => void;
	activeFilter: boolean;
	modalId: string;
}
const getPath = (alias: string): string => {
	if (alias == 'w') return 'web/index';
	if (alias == 'm') return 'mobile';
	if (alias == 'c') return 'cloud';
	if (alias == 'sc') return 'source';
	if (alias == 's') return 'se';
	return 'lan';
};
export const ViewResourcesTable: FC<OrderCloudScopeProps> = ({
	type,
	scopeALias,
	handleSelect,
	activeFilter,
	modalId,
}) => {
	const { getAnyResource } = useGetResources();
	const getDataScopeResourceTable = useGetScopeTables(activeFilter, true);
	const [isLoading, setLoading] = useState<boolean>(false);
	const dataTable = useRef<any>({
		columns: [{ ID: { value: '', style: '' } }],
		rows: [],
	});

	useEffect(() => {
		setLoading(true);

		getAnyResource(getPath(scopeALias))
			.then((resources) => {
				let filterResult = resources;
				dataTable.current = getDataScopeResourceTable(
					scopeALias,
					filterResult,
				);
			})
			.finally(() => setLoading(false));
		return () => {
			dataTable.current = {
				columns: [],
				rows: [],
			};
		};
	}, [scopeALias]);

	const title =
		modalId == 'selectReport'
			? `Select your ${type} resource to generate report`
			: `Select your ${type} resource to create issue`;
	return (
		<>
			<h3>{title}</h3>
			<TableV2
				columns={dataTable.current.columns}
				rowsData={dataTable.current.rows}
				showRows={!isLoading}
				showEmpty={!isLoading && !Boolean(dataTable.current.rows.length)}
				sizeY={15}
				selectItem={(item: any) => {
					let id = item;
					if (activeFilter) id = item.ID;
					handleSelect(
						id,
						type.startsWith('source') ? 'source' : type,
						Number(item.issueCount),
					);
				}}
			/>
		</>
	);
};
