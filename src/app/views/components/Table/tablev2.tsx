import React, {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	RUNNING_DESKTOP,
	calculateRowCalcX,
	calculateRowSize,
	calculateRowSizeX,
	formatDate,
	generateIDArray,
} from '../../../data';
import { EmptyCard, PageLoader, Show } from '..';
import './table.scss';

export enum Sort {
	asc = 'asc',
	desc = 'desc',
}

interface TableProps {
	rowsData: Record<string, TableItem>[];
	columns: ColumnTable[];
	showRows: boolean;
	showEmpty: boolean;
	tableAction?: TableAction;
	sizeY: number | string;
	sizeX?: number;
	isSmall?: boolean;
	selectItem?: (item: any) => void;
	sort?: Sort;
	initialSelect?: boolean;
	urlNav?: string;
}

export interface ColumnTable {
	name: string;
	value: string;
	style: string;
}

export interface TableItem {
	value: string | JSX.Element;
	style: string;
}

export interface TableAction {
	icon: Array<{
		action: (id: string, type?: any) => void;
		render: JSX.Element;
	}>;
	style: string;
}

const TableColumns: React.FC<any> = (props) => {
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
		[
			props.dataSort,
			props.sortDirection,
			props.updateDirection,
			props.updateSortData,
		],
	);

	const isAsc = props.sortDirection === Sort.asc;
	return (
		<div className="columns-name">
			{props.columns.map((column: ColumnTable, i: number) => (
				<div
					className={`column ${column?.style}`}
					key={i}
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

const TableRows: React.FC<any> = ({
	rowsData,
	isActiveAction,
	columns,
	sortDirection,
	dataSort,
	tableAction,
	selectedField,
	urlNav,
	handleSelected,
	initialSelect,
}) => {
	const [flattenedRows, setFlattenedRows] = useState<any[]>([]);

	useEffect(() => {
		if (rowsData) {
			const flattened = [...rowsData].flatMap((data: any) => data);
			setFlattenedRows(flattened);
		}
	}, [rowsData]);

	const rows = useMemo(() => {
		return flattenedRows.sort((a: any, b: any) => {
			//Search for the value of the object by which you want to sort
			let aValue = a[dataSort]?.value;
			let bValue = b[dataSort]?.value;

			if (typeof aValue === 'object' && aValue.props?.riskScore) {
				aValue = aValue.props.riskScore;
				bValue = bValue.props.riskScore;
			}
			if (typeof aValue === 'object' && aValue.props?.country) {
				aValue = aValue.props.country;
				bValue = bValue.props.country;
			}
			const isNumber = typeof aValue === 'number';
			const isString = typeof aValue === 'string';

			if (sortDirection === Sort.asc) {
				//Change the sorting based on the data type of the value
				if (isNumber) {
					return bValue - aValue;
				} else if (isString) {
					return bValue.localeCompare(aValue);
				} else {
					//Check if it is less, greater or equal
					return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
				}
			} else {
				if (isNumber) {
					return aValue - bValue;
				} else if (isString) {
					return aValue.localeCompare(bValue);
				} else {
					//Check if it is less, greater or equal
					return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
				}
			}
		});
	}, [flattenedRows, dataSort, sortDirection]);

	const rowsID = useMemo(() => generateIDArray(rows.length), [rows.length]);

	const columnForRows = useMemo(() => {
		//If the table action is present, it is removed from "columns" so that it does not appear
		let result = isActiveAction
			? columns.filter((column: ColumnTable) => column.name !== 'action')
			: columns;
		return result ?? [];
	}, [columns]);

	const handleClick = (e: any, i: number, rowId: any) => {
		handleSelected(e, rowsID[i], rowId);
	};

	useEffect(() => {
		initialSelect(rowsID[0]);
	}, []);

	return (
		<div className="rows">
			{rows.map((row: Record<string, TableItem>, rowIndex: number) => (
				<a
					key={rowsID[rowIndex]}
					className={`item ${
						selectedField === rowsID[rowIndex] ? 'left-marked' : ''
					}`}
					href={urlNav ? `${urlNav}${row['ID'].value}` : ''}
					onClick={(e) => handleClick(e, rowIndex, row['ID'].value)}>
					{columnForRows.map((column: ColumnTable, i: number) => (
						<div
							key={i}
							className={row[column.name as keyof typeof row]?.style}>
							<div className="publish">
								{column.name !== 'published'
									? row[column.name as keyof typeof row]?.value
									: formatDate(
											String(
												row[column.name as keyof typeof row]?.value,
											),
										)}
							</div>
						</div>
					))}
					<Show when={isActiveAction}>
						<>
							{tableAction?.icon?.map((i: any, iconIndex: any) => (
								<div
									key={iconIndex}
									className={tableAction?.style}
									onClick={(e: React.FormEvent) => {
										e.preventDefault();
										e.stopPropagation();
										i.action(row['ID'].value as string);
									}}>
									{i.render}
								</div>
							))}
						</>
					</Show>
				</a>
			))}
		</div>
	);
};

export const TableV2: React.FC<TableProps> = ({
	rowsData,
	columns,
	showRows,
	tableAction,
	sizeY = 100,
	showEmpty,
	isSmall = false,
	selectItem,
	sort = Sort.desc,
	initialSelect = false,
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

	const initSelectField = (id: any) => {
		if (Boolean(initialSelect)) {
			setSelectedField(id);
		}
	};

	const urlForRowItem = RUNNING_DESKTOP() ? '' : urlNav || '';

	return (
		<>
			<div
				className={`table ${isSmall && 'small'}`}
				style={
					{
						'--row-size': calculateRowSize(sizeY),
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
						initialSelect={initSelectField}
					/>
				</Show>
				<Show when={showEmpty}>
					<EmptyCard />
				</Show>
			</div>
		</>
	);
};
