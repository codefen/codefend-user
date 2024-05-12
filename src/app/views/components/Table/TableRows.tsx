import { useMemo, type ReactNode, Fragment, type FC } from 'react';
import { flattenRowsData, formatDate, quickSort } from '@utils/helper.ts';
import Show from '@defaults/Show.tsx';
import {
	Sort,
	type ColumnTable,
	type TableAction,
	type TableItem,
} from '@interfaces/table.ts';
import ActionColumn from './TableActionColumn';

interface TableRowsProps {
	rowsData: Record<string, TableItem>[];
	isActiveAction: boolean;
	columns: ColumnTable[];
	sortDirection: Sort;
	dataSort: string;
	tableAction?: TableAction;
	selectedField: string;
	urlNav?: string;
	handleSelected: (
		e: any,
		key: string,
		ID: string,
		issueCount?: string | number,
	) => void;
}

const rowsID2 = (i: number, ID: string) => `rowi-${i}-${ID}`;

const filterForRow = (columns: ColumnTable[], isActiveAction: boolean) => {
	const columnForRows: ColumnTable[] = [];
	for (const column of columns) {
		if (isActiveAction && column.name === 'action') {
			continue;
		}
		columnForRows.push(column);
	}
	return columnForRows;
};

const TableRows: FC<TableRowsProps> = ({
	rowsData,
	isActiveAction,
	columns,
	sortDirection,
	dataSort,
	tableAction,
	selectedField,
	urlNav,
	handleSelected,
}) => {
	const flattenedRows = useMemo(() => flattenRowsData(rowsData), [rowsData]);
	const rows = useMemo(
		() => quickSort(flattenedRows.slice(), dataSort, sortDirection),
		[dataSort, sortDirection, flattenedRows],
	);
	const columnForRows = filterForRow(columns, isActiveAction);

	const handleClick = (
		e: any,
		key: string,
		rowId: any,
		issueCount?: string | number,
	) => handleSelected(e, key, rowId, issueCount);

	return (
		<div className="rows">
			{rows.map((row: Record<string, TableItem>, rowIndex: number) => (
				<Fragment key={rowsID2(rowIndex, row['ID'].value as string)}>
					<a
						className={`item ${!urlNav ? 'item-with-out-action' : ''} ${row['issue'] && Number(row['issue']?.value as number) <= 0 ? 'item-disabled' : ''} ${
							selectedField ===
							rowsID2(rowIndex, row['ID'].value as string)
								? 'left-marked'
								: ''
						}`}
						href={urlNav ? `${urlNav}${row['ID'].value}` : ''}
						onClick={(e) =>
							handleClick(
								e,
								rowsID2(rowIndex, row['ID'].value as string),
								row['ID'].value,
								row['issue'] ? Number(row['issue'].value) : undefined,
							)
						}>
						{columnForRows.map((column: ColumnTable, i: number) => (
							<Fragment key={i}>
								{column.name !== 'childs' && (
									<div
										className={
											row[column.name as keyof typeof row]?.style
										}>
										<div className="publish">
											{!column.name.startsWith('publish')
												? (row[column.name as keyof typeof row]
														?.value as ReactNode)
												: formatDate(
														String(
															row[
																column.name as keyof typeof row
															]?.value,
														),
													)}
										</div>
									</div>
								)}
							</Fragment>
						))}
						<Show when={isActiveAction}>
							<ActionColumn actions={tableAction!} row={row} />
						</Show>
					</a>
					{row['childs'] && typeof row['childs'].value === 'function'
						? row['childs'].value({
								urlNav,
								handleClick,
								selectedField,
							})!
						: ''}
				</Fragment>
			))}
		</div>
	);
};

export default TableRows;
