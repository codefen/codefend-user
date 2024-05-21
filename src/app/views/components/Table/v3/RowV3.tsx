import type { ColumnTableV3 } from '@interfaces/table';
import { PureComponent, useMemo, type FC, type ReactNode } from 'react';
import useTableStoreV3 from './tablev3.store';

interface RowProps {
	row: any;
	nextRow?: any;
	columns: ColumnTableV3[];
}

const RowV3: FC<RowProps> = ({ row, columns, nextRow }) => {
	const renderContent = useMemo(() => {
		return columns.map((column, i) => (
			<div
				key={`ric-${i}`}
				className={`item-cell ${column.styles}`}
				style={{ '--cell-expand': column.weight } as any}>
				{column.render(
					!column.key.startsWith('full') ? row[column.key] : row,
					column.key === 'full-c' ? nextRow : null,
				)}
			</div>
		));
	}, [row, nextRow]);

	return renderContent;
};

export default RowV3;
