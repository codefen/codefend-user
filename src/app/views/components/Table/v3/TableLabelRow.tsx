import { TABLE_KEYS } from '@/app/constants/app-texts';
import { type ChangeEvent, type FC } from 'react';
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
	handleChecked,
	selectedItems,
}) => {
	const ID = row[TABLE_KEYS.ID];
	return (
		<label className={`item label ${itemDisable}`} data-id={ID}>
			<div className="item-cell" style={{ '--cell-expand': '2.5%' } as any}>
				<input
					id={`t-row-${ID}`}
					type="checkbox"
					name="t-row"
					value={ID}
					className="codefend-checkbox"
					checked={selectedItems.includes(ID)}
					onChange={handleChecked}
				/>
			</div>
			<TableCellV3 row={row} nextRow={nextRow} columns={columns} />
		</label>
	);
};

export default TableLabelRow;
