import { useRef, useState, type FC } from 'react';
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
	const [selectionBox, setSelectionBox] = useState({
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
	});
	const [isSelecting, setIsSelecting] = useState(false);
	const tableRef = useRef<HTMLDivElement>(null);
	const { setSelectedItems, selectedItems, cleanSelected, removeItem } =
		useTableStoreV3();
	const preProcessedRows = usePreProcessedRows(
		rows,
		initialOrder,
		sortedColumn,
		sort,
		term,
	);

	const handleMouseDown = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		if (!isNeedMultipleCheck && !isSelecting) return;
		setIsSelecting(true);
		setSelectionBox({
			startX: e.clientX,
			startY: e.clientY,
			endX: e.clientX,
			endY: e.clientY,
		});
	};

	const handleMouseMove = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
	) => {
		if (isSelecting) {
			setSelectionBox((prevBox) => ({
				...prevBox,
				endX: e.clientX,
				endY: e.clientY,
			}));

			if (tableRef.current) {
				const items = tableRef.current.querySelectorAll('.item');

				for (const item of items) {
					const rect = item.getBoundingClientRect();
					const id = item.getAttribute('data-id');

					const selectionBoxLeft = Math.min(
						selectionBox.startX,
						selectionBox.endX,
					);
					const selectionBoxRight = Math.max(
						selectionBox.startX,
						selectionBox.endX,
					);
					const selectionBoxTop = Math.min(
						selectionBox.startY,
						selectionBox.endY,
					);
					const selectionBoxBottom = Math.max(
						selectionBox.startY,
						selectionBox.endY,
					);

					const isInSelectionBox =
						rect.right >= selectionBoxLeft &&
						rect.left <= selectionBoxRight &&
						rect.bottom >= selectionBoxTop &&
						rect.top <= selectionBoxBottom;

					if (isInSelectionBox && !selectedItems.includes(id)) {
						setSelectedItems(id);
					} else if (!isInSelectionBox && selectedItems.includes(id)) {
						console.log('Entreee ?? EN MOUSE MOVE');
						removeItem(id || '');
					}
				}
			}
		}
	};

	const handleMouseUp = () => {
		setIsSelecting(false);
	};

	return (
		<div className="table-group">
			<div className="table-utils table-search-bar">
				<ModalInput
					icon={<MagnifyingGlassIcon />}
					setValue={(val: string) => setTerm(val)}
					placeholder="Search resource. . ."
				/>
			</div>
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
							backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
