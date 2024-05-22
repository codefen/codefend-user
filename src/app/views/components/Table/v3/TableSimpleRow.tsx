import { useMemo, type FC } from 'react';
import TableCellV3 from './TableCellV3';

interface LabelRowProps {
	itemDisable: string;
	row: any;
	nextRow?: any;
	columns: any;
}

const TableSimpleRow: FC<LabelRowProps> = ({
	itemDisable,
	row,
	nextRow,
	columns,
}) => {
	const handleClick = (e: any, item: any) => {};

	return (
		<div
			className={`item ${itemDisable}`}
			onClick={(e) => handleClick(e, row)}>
			<TableCellV3 row={row} nextRow={nextRow} columns={columns} />
		</div>
	);
};

export default TableSimpleRow;
