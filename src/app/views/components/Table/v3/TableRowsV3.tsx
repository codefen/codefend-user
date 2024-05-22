import { type ChangeEvent, type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table.ts';
import RowV3 from './RowV3';
import { flattenRows } from '@utils/sort.service';
import useTableStoreV3 from './tablev3.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';

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
	const handleChecked = (e: ChangeEvent<HTMLInputElement>, id: string) => {
		if (e.target.checked && !selectedItems.includes(id)) {
			setSelectedItems(e.target.value);
		} else if (!e.target.checked && selectedItems.includes(id)) {
			removeItem(e.target.value);
		}
	};

	const getRows = (r: any[]) => {
		let rows: JSX.Element[] = [];
		const rowCount = r.length;
		for (let i = 0; i < rowCount; i++) {
			const itemDisable = ` ${isActiveDisable && r[i][TABLE_KEYS.COUNT_ISSUE] && r[i][TABLE_KEYS.COUNT_ISSUE] <= 0 ? 'item-disabled' : ''}`;
			if (urlNav) {
				const needUrl = !urlNav ? 'item-with-out-action' : '';
				rows[i] = (
					<a
						data-id={r[i]['id']}
						className={`item ${itemDisable} ${needUrl}`}
						href={urlNav ? `${urlNav}${r[i]['id']}` : ''}>
						<RowV3
							key={`r-${r[i]['id']}-${i}`}
							row={r[i]}
							nextRow={r?.[i + 1]}
							columns={columns}
						/>
					</a>
				);
			} else if (isNeedMultipleCheck) {
				rows[i] = (
					<label
						className={`item label ${itemDisable}`}
						data-id={r[i][TABLE_KEYS.ID]}>
						<div
							className="item-cell"
							style={{ '--cell-expand': '2.5%' } as any}>
							<input
								type="checkbox"
								name="t-rows"
								value={r[i][TABLE_KEYS.ID]}
								className="codefend-checkbox"
								defaultChecked={selectedItems.includes(
									r[i][TABLE_KEYS.ID],
								)}
								checked={selectedItems.includes(r[i][TABLE_KEYS.ID])}
								onChange={(e) => handleChecked(e, r[i][TABLE_KEYS.ID])}
							/>
						</div>
						<RowV3
							key={`r-${r[i][TABLE_KEYS.ID]}-${i}`}
							row={r[i]}
							nextRow={r?.[i + 1]}
							columns={columns}
						/>
					</label>
				);
			} else {
				rows[i] = (
					<div
						className={`item ${itemDisable}`}
						onClick={(e) => handleClick(e, r[i])}>
						<RowV3
							key={`r-${r[i][TABLE_KEYS.ID]}-${i}`}
							row={r[i]}
							nextRow={r?.[i + 1]}
							columns={columns}
						/>
					</div>
				);
			}
		}
		return rows;
	};

	return getRows(flattenedRows);
};

export default TableRowsV3;
