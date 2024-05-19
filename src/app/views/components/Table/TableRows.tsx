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
import Row from './Row';

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

	const getRows = (r: Record<string, TableItem>[]) => {
		let rows: JSX.Element[] = [];
		const rowCount = r.length;
		for (let i = 0; i < rowCount; i++) {
			rows[i] = (
				<Row
					key={`row-${r[i]['ID'].value}-${i}`}
					row={r[i]}
					rowIndex={i}
					columns={columnForRows}
					urlNav={urlNav}
					selectedField={selectedField}
					handleClick={handleClick}
					isActiveAction={isActiveAction}
					tableAction={tableAction}
				/>
			);
		}
		return rows;
	};

	return <div className="rows">{getRows(rows)}</div>;
};

export default TableRows;
