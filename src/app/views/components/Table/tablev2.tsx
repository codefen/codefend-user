import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { formatDate, generateIDArray } from '../../../data';
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
	sizeY: number;
	sizeX?: number;
	isSmall?: boolean;
	selectItem?: (item: any) => void;
	sort?: Sort;
	initialSelect?: boolean;
	whelAction?: (id: string) => void;
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
	whelAction,
}) => {
	const [sortDirection, setSortDirection] = useState<Sort>(sort);
	const [dataSort, setDataSort] = useState<string>(columns[0].name);
	const [selectedField, setSelectedField] = useState('');

	const rows = useMemo(() => {
		const rows =
			rowsData == undefined
				? []
				: [...rowsData].flatMap((data: any) => data);
		return rows.sort((a: any, b: any) => {
			//Search for the value of the object by which you want to sort
			const aValue = a[dataSort]?.value;
			const bValue = b[dataSort]?.value;

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
	}, [rowsData, dataSort, sortDirection]);
	const rowsID = useMemo(() => generateIDArray(rows.length), [rows.length]);
	const columnsID = useMemo(() => generateIDArray(columns.length), [columns]);

	const handleSort = (columnName: string) => {
		if (columnName === dataSort) {
			//Change the column sort direction
			setSortDirection((prevDirection) =>
				prevDirection === Sort.asc ? Sort.desc : Sort.asc,
			);
		} else {
			setDataSort(columnName);
			setSortDirection(Sort.asc);
		}
	};

	const columnForRows = useMemo(() => {
		//If the table action is present, it is removed from "columns" so that it does not appear
		let result =
			tableAction !== undefined
				? columns.filter((column) => column.name !== 'action')
				: columns;
		return result ?? [];
	}, [columns]);

	const handleSelected = (e: any, key: string, ID: string) => {
		e.preventDefault();
		if (selectItem !== undefined) {
			selectItem(ID);
		}

		if (key === selectedField) {
			setSelectedField('');
		} else {
			setSelectedField(key);
		}
	};

	useEffect(() => {
		if (Boolean(initialSelect)) {
			setSelectedField(rowsID[0]);
		}
	}, [rowsID]);

	return (
		<>
			<div
				className={`table ${isSmall && 'small'}`}
				style={
					{
						'--row-size': sizeY + 'dvh',
						'--row-size-x': sizeX + '%',
						'--row-calc-x': (sizeX < 100 ? 100 - sizeX - 3 : 0) + '%',
					} as any
				}>
				<div className="columns-name">
					{columns.map((column: ColumnTable, i: number) => (
						<div
							className={`column ${column?.style}`}
							key={columnsID[i]}
							onClick={() => {
								if (column.name === 'action') return;
								handleSort(column.name);
							}}>
							{column.value}
							<Show
								when={
									dataSort === column.name &&
									sortDirection === Sort.asc
								}>
								<span className="sort">{'↑'}</span>
							</Show>
							<Show
								when={
									dataSort === column.name &&
									sortDirection === Sort.desc
								}>
								<span className="sort">{'↓'}</span>
							</Show>
							{dataSort !== column.name && column.name !== 'action' && (
								<span className="sort active">{'↓'}</span>
							)}
						</div>
					))}
				</div>

				<Show
					when={showRows !== undefined && showRows}
					fallback={<PageLoader />}>
					<div className="rows">
						{rows.map(
							(row: Record<string, TableItem>, rowIndex: number) => (
								<Fragment key={rowsID[rowIndex]}>
									<div
										className={`item ${
											selectedField === rowsID[rowIndex]
												? 'left-marked'
												: ''
										}`}
										onMouseDown={(e) => {
											e.preventDefault();
											if (e.button === 1) {
												e.stopPropagation();

												if (whelAction) {
													whelAction(row['ID'].value as string);
												}
											}
										}}
										onClick={(e: any) => {
											handleSelected(
												e,
												rowsID[rowIndex],
												row['ID'].value as string,
											);
										}}>
										{columnForRows.map(
											(column: ColumnTable, i: number) => (
												<div
													key={i}
													className={
														row[column.name as keyof typeof row]
															?.style
													}>
													<div className="publish">
														{column.name !== 'published'
															? row[
																	column.name as keyof typeof row
																]?.value
															: formatDate(
																	String(
																		row[
																			column.name as keyof typeof row
																		]?.value,
																	),
																)}
													</div>
												</div>
											),
										)}
										<Show when={tableAction !== undefined}>
											<>
												{tableAction?.icon?.map((i, iconIndex) => (
													<div
														key={iconIndex}
														className={tableAction?.style}
														onClick={(e: React.FormEvent) => {
															e.preventDefault();
															e.stopPropagation();
															i.action(
																row['ID'].value as string,
															);
														}}>
														{i.render}
													</div>
												))}
											</>
										</Show>
									</div>
								</Fragment>
							),
						)}
					</div>
				</Show>
				<Show when={showEmpty}>
					<EmptyCard />
				</Show>
			</div>
		</>
	);
};
