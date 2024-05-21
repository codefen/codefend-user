import { useCallback, type FC } from 'react';
import { Sort } from '@interfaces/table.ts';
import useTableStoreV3 from './tablev3.store';

interface TableColumnsProps {
	columns: any[];
	sortedColumn: string;
	sort: Sort;
	isNeedMultipleCheck: boolean;
	setSortColumn: (updated: string) => void;
	setSort: (updated: Sort) => void;
}

const TableColumnsV3: FC<TableColumnsProps> = ({
	sortedColumn,
	sort,
	columns,
	setSort,
	setSortColumn,
	isNeedMultipleCheck,
}) => {
	const { toggleSelectAll, activetSelectAll } = useTableStoreV3();
	const handleSort = useCallback((cn: string, cds: string, cs: Sort) => {
		if (cn === cds) {
			setSort(cs === Sort.asc ? Sort.desc : Sort.asc);
		} else {
			setSortColumn(cn);
			setSort(Sort.asc);
		}
	}, []);
	const onclcik = (column: string) => {
		if (column === 'action') return;
		handleSort(column, sortedColumn, sort);
	};

	return (
		<div className="columns-name">
			{columns.map((column: any, i: number) => (
				<div
					className={`column item-cell ${column.styles}`}
					key={`cv3-${i}`}
					style={{ '--cell-expand': column.weight } as any}
					onClick={() => onclcik(column.key)}>
					{column.header}
					{sortedColumn === column.key && (
						<span className="sort">{sort === Sort.asc ? '↑' : '↓'}</span>
					)}
				</div>
			))}
		</div>
	);
};

export default TableColumnsV3;
