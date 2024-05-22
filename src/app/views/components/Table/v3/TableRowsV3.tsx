import { type ChangeEvent, type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table.ts';
import { flattenRows } from '@utils/sort.service';
import useTableStoreV3 from './tablev3.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import TableLabelRow from './TableLabelRow';
import TableAnchorRow from './TableAnchorRow';
import TableSimpleRow from './TableSimpleRow';

interface TableRowsProps {
	rows: any[];
	columns: ColumnTableV3[];
	urlNav?: string;
	isActiveDisable: boolean;
	isNeedMultipleCheck: boolean;
}

const TableRowsV3: FC<TableRowsProps> = ({
	rows,
	columns,
	urlNav,
	isActiveDisable,
	isNeedMultipleCheck,
}) => {
	const flattenedRows = flattenRows(rows);
	const { selectedItems, setSelectedItems, removeItem } = useTableStoreV3();
	const handleClick = (e: any, item: any) => {};
	const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;
		const isIncluded = selectedItems.includes(value);
		if (checked && !isIncluded) {
			setSelectedItems(value);
		} else if (!checked && isIncluded) {
			removeItem(value);
		}
	};

	const getRows = (r: any[]) => {
		let rows: JSX.Element[] = [];
		const rowCount = r.length;
		for (let i = 0; i < rowCount; i++) {
			const itemDisable = ` ${isActiveDisable && r[i][TABLE_KEYS.COUNT_ISSUE] && r[i][TABLE_KEYS.COUNT_ISSUE] <= 0 ? 'item-disabled' : ''}`;
			if (urlNav) {
				rows[i] = (
					<TableAnchorRow
						columns={columns}
						itemDisable={itemDisable}
						row={r[i]}
						nextRow={r?.[i + 1]}
						urlNav={urlNav}
					/>
				);
			} else if (isNeedMultipleCheck) {
				rows[i] = (
					<TableLabelRow
						columns={columns}
						itemDisable={itemDisable}
						row={r[i]}
						nextRow={r?.[i + 1]}
						selectedItems={selectedItems}
						handleChecked={handleChecked}
					/>
				);
			} else {
				rows[i] = (
					<TableSimpleRow
						columns={columns}
						itemDisable={itemDisable}
						row={r[i]}
						nextRow={r?.[i + 1]}
					/>
				);
			}
		}
		return rows;
	};

	return getRows(flattenedRows);
};

export default TableRowsV3;
