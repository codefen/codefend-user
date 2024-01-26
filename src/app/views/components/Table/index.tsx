import React, { useMemo, useState } from 'react';
import { generateIDArray } from '../../../data';
import { Show } from '..';
import './table.module.scss';

enum Sort {
	asc = 'asc',
	desc = 'desc',
}

interface TableProps {
	data: any[];
	columns: string[];
}

export const Table: React.FC<TableProps> = ({ data, columns }) => {
	const [sortDirection, setSortDirection] = useState<Sort>(Sort.asc);
	const [dataSort, setDataSort] = useState<string>(columns[0]);

	const rows = useMemo(() => {
		return [...data].sort((a: any, b: any) => {
			const aValue = a[dataSort];
			const bValue = b[dataSort];

			if (sortDirection === Sort.asc) {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});
	}, [data, dataSort, sortDirection]);

	const columnsID = useMemo(() => generateIDArray(columns.length), [columns]);
	const rowsID = useMemo(() => generateIDArray(rows.length), [rows]);

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

	const rowsColKey = useMemo(() => generateIDArray(columns.length), [columns]);

	const getRowValue = (row: any, column: string) => {
		if (column.startsWith('phone')) return row['phone'];
		if (column === 'issue title') return row['issueTitle'];
		if (column === 'role') return row['companyRole'];

		return row[column];
	};

	return (
		<>
			<div className="table__title__header"></div>

			<div>
				<table>
					<thead>
						<tr>
							{columns.map((keyTable: string, i: number) => (
								<th
									scope="col"
									key={columnsID[i]}
									onClick={() => handleSort(keyTable)}>
									{`${keyTable} `}
									<Show
										when={
											dataSort === keyTable &&
											sortDirection === Sort.asc
										}>
										<>{'↑'}</>
									</Show>
									<Show
										when={
											dataSort === keyTable &&
											sortDirection === Sort.desc
										}>
										<>{'↓'}</>
									</Show>
								</th>
							))}
						</tr>
					</thead>
					<tbody style={{ overflowX: 'auto' }}>
						{rows.map((row: any, rowIndex: number) => (
							<tr key={rowsID[rowIndex]}>
								{columns.map((column: string, colIndex: number) => (
									<td
										key={rowsColKey[colIndex]}
										title={row[column.toLowerCase()]}>
										{getRowValue(row, column.toLowerCase())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
