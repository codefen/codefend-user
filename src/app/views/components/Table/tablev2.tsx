import React, { Fragment, useMemo, useState } from 'react';
import { generateIDArray } from '../../../data';
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
	isSmall?: boolean;
	selectItem?: (item: any) => void;
	sort?: Sort;
	initialSelect?: boolean;
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
	icon: JSX.Element;
	style: string;
	action: (id: string) => void;
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
}) => {
	const [sortDirection, setSortDirection] = useState<Sort>(sort);
	const [dataSort, setDataSort] = useState<string>(columns[0].name);
	const rows = useMemo(() => {
		return [...rowsData].sort((a: any, b: any) => {
			const aValue = a[dataSort].value;
			const bValue = b[dataSort].value;

			if (sortDirection === Sort.asc) {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});
	}, [rowsData, dataSort, sortDirection]);
	const rowsID = useMemo(() => generateIDArray(rows.length), [rows.length]);
	const [selectedField, setSelectedField] = useState<string>(
		initialSelect ? rowsID[0] : '',
	);

	const columnsID = useMemo(() => generateIDArray(columns.length), [columns]);

	const handleSort = (columnName: string) => {
		if (columnName === dataSort) {
			setSortDirection((prevDirection) =>
				prevDirection === Sort.asc ? Sort.desc : Sort.asc,
			);
		} else {
			setDataSort(columnName);
			setSortDirection(Sort.asc);
		}
	};

	const columnForRows = useMemo(() => {
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

		if (key === selectedField) setSelectedField('');
		else setSelectedField(key);
	};

	return (
		<>
			<div className={`table ${isSmall && 'small'}`}>
				<div className="columns-name">
					{columns.map((column: ColumnTable, i: number) => (
						<div
							className={column.style}
							key={columnsID[i]}
							onClick={() => handleSort(column.name)}>
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
						</div>
					))}
				</div>

				<Show
					when={showRows !== undefined && showRows}
					fallback={<PageLoader />}>
					<div
						className="rows"
						style={{ '--row-size': sizeY + 'dvh' } as any}>
						{rows.map(
							(row: Record<string, TableItem>, rowIndex: number) => (
								<Fragment key={rowsID[rowIndex]}>
									<div
										className={`item ${
											selectedField === rowsID[rowIndex]
												? 'left-marked'
												: ''
										}`}
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
															.style
													}>
													<div>
														{
															row[
																column.name as keyof typeof row
															].value
														}
													</div>
												</div>
											),
										)}
										<Show when={tableAction !== undefined}>
											<div
												className={tableAction?.style}
												onClick={(e: React.FormEvent) => {
													e.preventDefault();
													e.stopPropagation();
													tableAction?.action(
														row['ID'].value as string,
													);
												}}>
												{tableAction?.icon}
											</div>
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
