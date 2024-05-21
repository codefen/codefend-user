import { useEffect, useRef, useState, type FC } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import usePreProcessedRows from '@hooks/table/usePreprocesorRows';
import TableColumnsV3 from './TableColumnsV3';
import TableRowsV3 from './TableRowsV3';
import Show from '@defaults/Show';
import EmptyCard from '@defaults/EmptyCard';
import { PageLoader } from '@defaults/loaders/Loader';
import './tablev3.scss';
import useTableStoreV3 from './tablev3.store';
import { ModalInput } from '@defaults/ModalInput';
import { CloseIcon, MagnifyingGlassIcon } from '@icons';

interface Tablev3Props<T> {
	rows: T[];
	columns: ColumnTableV3[];
	showRows: boolean;

	className?: string;
	initialSort?: Sort;
	initialOrder?: string;
	urlNav?: string;
	isActiveDisable?: boolean;
	isNeedMultipleCheck?: boolean;
}

const Tablev3: FC<Tablev3Props<any>> = ({
	className = '',
	initialSort = Sort.asc,
	initialOrder = '',
	rows = [],
	columns,
	urlNav,
	showRows,
	isActiveDisable = false,
	isNeedMultipleCheck = false,
}) => {
	const [sort, setSort] = useState<Sort>(initialSort);
	const [sortedColumn, setDataSort] = useState<string>(columns[0].key);
	const [term, setTerm] = useState<string>('');
	const { selectedItems, cleanSelected } = useTableStoreV3();
	const [selectionBox, setSelectionBox] = useState({
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
	});
	const [isSelecting, setIsSelecting] = useState(false);
	const prevSelectedItems = useRef<any[]>([]);
	const preProccessRow = usePreProcessedRows(
		rows,
		initialOrder,
		sortedColumn,
		sort,
		term,
	);
	return (
		<div className="table-group">
			<div
				className={`table-utils ${!Boolean(selectedItems.length) ? 'table-search-bar' : 'table-selected-actions'}`}>
				<Show when={!Boolean(selectedItems.length)}>
					<ModalInput
						icon={<MagnifyingGlassIcon />}
						setValue={(val: string) => setTerm(val)}
						placeholder="Search resource. . ."
					/>
				</Show>
				<Show when={Boolean(selectedItems.length)}>
					<div className="selected-action-content">
						<span className="un-selected" onClick={() => cleanSelected()}>
							<CloseIcon isButton />
						</span>
						<div className="selected-count">
							{selectedItems.length} selected
						</div>
						<div className="selected-warning">
							Warning! Only one pentest is requested of the resources you
							have selected
						</div>
					</div>
				</Show>
			</div>
			<div className={`table ${className}`}>
				<TableColumnsV3
					columns={columns}
					sortedColumn={sortedColumn}
					sort={sort}
					setSort={setSort}
					setSortColumn={setDataSort}
					isNeedMultipleCheck={isNeedMultipleCheck}
				/>

				<Show when={showRows} fallback={<PageLoader />}>
					<div className="rows">
						<TableRowsV3
							columns={columns}
							rows={preProccessRow}
							urlNav={urlNav}
							isActiveDisable={isActiveDisable}
							isNeedMultipleCheck={isNeedMultipleCheck}
						/>
					</div>
				</Show>
				<Show when={showRows && !Boolean(preProccessRow.length)}>
					<EmptyCard />
				</Show>
			</div>
		</div>
	);
};

export default Tablev3;
