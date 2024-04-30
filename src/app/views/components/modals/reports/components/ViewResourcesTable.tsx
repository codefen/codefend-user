import { useEffect, useRef, useState, type FC } from 'react';
import { useGetScopeTables } from '@hooks/useGetScopeTables';
import { TableV2 } from '@table/tablev2';
import { useGetResources } from '@resourcesHooks/useGetResources';

export interface OrderCloudScopeProps {
	type: string;
	scopeALias: 'w' | 'm' | 'c' | 's' | 'sc' | 'n';
	getReport: (id: string, type: string) => void;
}
const getPath = (alias: string) => {
	if (alias == 'w') return 'web/index';
	if (alias == 'm') return 'mobile';
	if (alias == 'c') return 'cloud';
	if (alias == 'sc') return 'source';
	return 'lan';
};
export const ViewResourcesTable: FC<OrderCloudScopeProps> = ({
	type,
	scopeALias,
	getReport,
}) => {
	const { getAnyResource } = useGetResources();
	const getDataScopeResourceTable = useGetScopeTables();
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
				if (scopeALias == 'w') {
					filterResult = filterResult.filter(
						(resource: any) => resource.final_issues > 0,
					);
				}
				dataTable.current = getDataScopeResourceTable(
					scopeALias,
					filterResult,
				);
			})
			.finally(() => setLoading(false));
	}, [scopeALias]);

	return (
		<>
			<h3>Select your {type} resource to generate report</h3>
			<TableV2
				columns={dataTable.current.columns}
				rowsData={dataTable.current.rows}
				showRows={!isLoading}
				showEmpty={!isLoading && !Boolean(dataTable.current.rows.length)}
				sizeY={15}
				selectItem={(id: string) => {
					getReport(id, type.startsWith('source') ? 'source' : type);
				}}
			/>
		</>
	);
};
