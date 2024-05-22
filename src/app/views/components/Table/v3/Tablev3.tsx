import { useState, type FC } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import usePreProcessedRows from '@hooks/table/usePreprocesorRows';
import TableColumnsV3 from './TableColumnsV3';
import TableRowsV3 from './TableRowsV3';
import Show from '@defaults/Show';
import EmptyCard from '@defaults/EmptyCard';
import { PageLoader } from '@defaults/loaders/Loader';
import { ModalInput } from '@defaults/ModalInput';
import { MagnifyingGlassIcon } from '@icons';
import { useMultipleSelect } from '@hooks/table/useMultipleSelect';
import './tablev3.scss';

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
	isNeedSearchBar?: boolean;
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
	isNeedSearchBar = false,
}) => {
	const [sort, setSort] = useState<Sort>(initialSort);
	const [sortedColumn, setDataSort] = useState<string>(columns[0].key);
	const [term, setTerm] = useState<string>('');
	const {
		tableRef,
		isSelecting,
		selectionBox,
		handleMouseUp,
		handleMouseMove,
		handleMouseDown,
	} = useMultipleSelect(isNeedMultipleCheck);
	const preProcessedRows = usePreProcessedRows(
		rows,
		initialOrder,
		sortedColumn,
		sort,
		term,
	);

	return (
		<div className="table-group">
			<Show when={isNeedSearchBar}>
				<div className="table-utils table-search-bar">
					<ModalInput
						icon={<MagnifyingGlassIcon />}
						setValue={(val: string) => setTerm(val)}
						placeholder="Search resource. . ."
					/>
				</div>
			</Show>

			<div
				className={`table ${className} ${isSelecting && 'table-item-no-selected'}`}
				ref={tableRef}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}>
				{isSelecting && (
					<div
						style={{
							position: 'absolute',
							left: Math.min(selectionBox.startX, selectionBox.endX),
							top: Math.min(selectionBox.startY, selectionBox.endY),
							width: Math.abs(selectionBox.endX - selectionBox.startX),
							height: Math.abs(selectionBox.endY - selectionBox.startY),
							backgroundColor: '#ffd5d54d',
							border: '1px solid #ffa0a0',
						}}
					/>
				)}
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
							rows={preProcessedRows}
							urlNav={urlNav}
							isActiveDisable={isActiveDisable}
							isNeedMultipleCheck={isNeedMultipleCheck}
						/>
					</div>
				</Show>
				<Show when={showRows && !Boolean(preProcessedRows.length)}>
					<EmptyCard />
				</Show>
			</div>
		</div>
	);
};

export default Tablev3;
