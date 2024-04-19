import React, {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
	Fragment,
	type FC,
} from 'react';
import {
	RUNNING_DESKTOP,
	calculateRowCalcX,
	calculateRowSizeX,
	flattenRowsData,
	formatDate,
	quickSort,
} from '@utils/helper.ts';
import Show from '@defaults/Show.tsx';
import EmptyCard from '@defaults/EmptyCard.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import {
	type ColumnTable,
	type TableItem,
	type TableProps,
	Sort,
} from '@interfaces/table.ts';
import './table.scss';

const TableColumns: FC<any> = (props) => {
	const handleSort = useCallback(
		(columnName: string) => {
			if (columnName === props.dataSort) {
				props.updateDirection(
					props.sortDirection === Sort.asc ? Sort.desc : Sort.asc,
				);
			} else {
				props.updateSortData(columnName);
				props.updateDirection(Sort.asc);
			}
		},
		[props.dataSort, props.sortDirection],
	);

	const isAsc = props.sortDirection === Sort.asc;
	return (
		<div className="columns-name">
			{props.columns.map((column: ColumnTable, i: number) => (
				<div
					className={`column ${column?.style}`}
					key={`c-${i}`}
					onClick={() => {
						if (column.name === 'action') return;
						handleSort(column.name);
					}}>
					{column.value}
					{props.dataSort === column.name && (
						<span className="sort">{isAsc ? '↑' : '↓'}</span>
					)}
				</div>
			))}
		</div>
	);
};

const TableRows: FC<any> = ({
	rowsData,
	isActiveAction,
	columns,
	sortDirection,
	dataSort,
	tableAction,
	selectedField,
	urlNav,
	handleSelected,
}) => {
	const [flattenedRows, setFlattenedRows] = useState<any[]>([]);

	useEffect(() => {
		setFlattenedRows(flattenRowsData(rowsData));
	}, [rowsData]);

	const rows = useMemo(
		() => quickSort(flattenedRows.slice(), dataSort, sortDirection),
		[dataSort, sortDirection, flattenedRows],
	);

	const rowsID2 = (i: number, ID: string) => `rowi-${i}-${ID}`;

	const filterForRow = () => {
		const columnForRows: ColumnTable[] = [];
		for (const column of columns) {
			if (isActiveAction && column.name === 'action') {
				continue;
			}
			columnForRows.push(column);
		}
		return columnForRows;
	};

	const columnForRows = filterForRow();

	const handleClick = (e: any, key: string, rowId: any) =>
		handleSelected(e, key, rowId);

	return (
		<div className="rows">
			{rows.map((row: Record<string, TableItem>, rowIndex: number) => (
				<Fragment key={rowsID2(rowIndex, row['ID'].value as string)}>
					<a
						className={`item ${!urlNav && 'item-with-out-action'} ${
							selectedField ===
							rowsID2(rowIndex, row['ID'].value as string)
								? 'left-marked'
								: ''
						}`}
						href={urlNav ? `${urlNav}${row['ID'].value}` : ''}
						onClick={(e) =>
							handleClick(
								e,
								rowsID2(rowIndex, row['ID'].value as string),
								row['ID'].value,
							)
						}>
						{columnForRows.map((column: ColumnTable, i: number) => (
							<Fragment key={i}>
								{column.name !== 'childs' && (
									<div
										className={
											row[column.name as keyof typeof row]?.style
										}>
										<div className="publish">
											{column.name !== 'published'
												? (row[column.name as keyof typeof row]
														?.value as ReactNode)
												: formatDate(
														String(
															row[
																column.name as keyof typeof row
															]?.value,
														),
													)}
										</div>
									</div>
								)}
							</Fragment>
						))}
						<Show when={isActiveAction}>
							<div className="id action">
								{tableAction?.icon?.map((i: any, iconIndex: any) => (
									<span
										key={iconIndex}
										className={i?.style}
										onClick={(e: React.FormEvent) => {
											e.preventDefault();
											e.stopPropagation();
											i.action(row['ID'].value as string);
										}}>
										{typeof i.render === 'function'
											? i.render({ extraAttr: row['issue'] })
											: i.render}
									</span>
								))}
							</div>
						</Show>
					</a>
					{row['childs'] && typeof row['childs'].value === 'function'
						? row['childs'].value({ urlNav, handleClick, selectedField })!
						: ''}
				</Fragment>
			))}
		</div>
	);
};

export const TableV2: FC<TableProps> = ({
	rowsData,
	columns,
	showRows,
	tableAction,
	showEmpty,
	isSmall = false,
	selectItem,
	sort = Sort.desc,
	sizeX = 100,
	urlNav,
}) => {
	const [sortDirection, setSortDirection] = useState<Sort>(sort);
	const [dataSort, setDataSort] = useState<string>(columns[0].name);
	const [selectedField, setSelectedField] = useState('');
	const handleSelected = (e: any, key: string, ID: string) => {
		e.preventDefault();
		if (selectItem !== undefined) {
			selectItem(ID);
			return;
		}

		if (key === selectedField) {
			setSelectedField('');
		} else {
			setSelectedField(key);
		}
	};

	const urlForRowItem = RUNNING_DESKTOP() ? '' : urlNav || '';

	return (
		<div
			className={`table ${isSmall && 'small'}`}
			style={
				{
					'--row-size-x': calculateRowSizeX(sizeX),
					'--row-calc-x': calculateRowCalcX(sizeX),
				} as any
			}>
			<TableColumns
				columns={columns}
				dataSort={dataSort}
				sortDirection={sortDirection}
				updateSortData={(updated: any) => setDataSort(updated)}
				updateDirection={(updated: any) => setSortDirection(updated)}
			/>

			<Show when={showRows} fallback={<PageLoader />}>
				<TableRows
					rowsData={rowsData}
					columns={columns}
					sortDirection={sortDirection}
					dataSort={dataSort}
					tableAction={tableAction}
					urlNav={urlForRowItem}
					handleSelected={handleSelected}
					isActiveAction={!!tableAction}
					selectedField={selectedField}
				/>
			</Show>
			<Show when={showEmpty}>
				<EmptyCard />
			</Show>
		</div>
	);
};
