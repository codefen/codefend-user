import { TABLE_KEYS } from '@/app/constants/app-texts';
import {  type ChangeEvent, type FC } from 'react';
import TableCellV3 from './TableCellV3';

interface LabelRowProps {
	itemDisable: string;
	row: any;
	nextRow?: any;
	columns: any;
	selectedItems: Readonly<string[]>;
	handleChecked: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TableLabelRow: FC<LabelRowProps> = ({
	itemDisable,
	row,
	nextRow,
	columns,
	selectedItems,
	handleChecked,
}) => {
	return (
		<label
			className={`item label ${itemDisable}`}
			data-id={row[TABLE_KEYS.ID]}>
			<div className="item-cell" style={{ '--cell-expand': '2.5%' } as any}>
				<input
					type="checkbox"
					name="t-rows"
					value={row[TABLE_KEYS.ID]}
					className="codefend-checkbox"
					checked={selectedItems.includes(row[TABLE_KEYS.ID])}
					onChange={handleChecked}
				/>
			</div>
			<TableCellV3 row={row} nextRow={nextRow} columns={columns} />
		</label>
	);
};

export default TableLabelRow;
