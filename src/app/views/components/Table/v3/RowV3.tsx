import type { ColumnTableV3 } from '@interfaces/table';
import { PureComponent, useMemo, type FC, type ReactNode } from 'react';
import useTableStoreV3 from './tablev3.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';

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
					!column.key.startsWith(TABLE_KEYS.FULL_ROW)
						? row[column.key]
						: row,
					column.key === TABLE_KEYS.FULL_WITH_NEXT ? nextRow : null,
				)}
			</div>
		));
	}, [row, nextRow]);

	return renderContent;
};

export default RowV3;
