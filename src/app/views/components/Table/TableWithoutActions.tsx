import React, { Fragment } from 'react';
import { ColumnTable, EmptyCard, PageLoader, Show, TableItem } from '..';
import { formatDate } from '../../../data';

export interface TableWithoutActionsProps {
	columns: ColumnTable[];
	isLoading: boolean;
	resources: Record<string, TableItem>[];
	id: number;
	needMarker?: boolean;
}

export const TableWithoutActions: React.FC<TableWithoutActionsProps> = ({
	columns,
	resources,
	isLoading,
	id,
	needMarker,
}) => {

	const ColumnActive: React.FC<any> = (props) => {
		if (props.column.name != 'childs') {
			return (
				<div
					className={`${props.row[props.column.name as keyof typeof props.row]?.style}`}>
					{props.column.name !== 'published'
						? props.row[props.column.name as keyof typeof props.row]
								?.value
						: formatDate(
								String(
									props.row[
										props.column.name as keyof typeof props.row
									]?.value,
								),
							)}
				</div>
			);
		}

		return <></>;
	};

	return (
		<div className="table">
			<div className="columns-name">
				{columns.map((column: ColumnTable, i: number) => (
					<div key={i + id + '-cl'} className={`column ${column?.style}`}>
						{column.value}
					</div>
				))}
			</div>
			{!isLoading ? (
				<div className="rows">
					{resources.map((row: Record<string, TableItem>, i: number) => (
						<Fragment key={i + id + '-row'}>
							<div className={`item ${needMarker && 'left-marked'}`}>
								{columns.map((column: ColumnTable, i: number) => (
									<ColumnActive
										key={i + id + '-i'}
										column={column}
										row={row}
									/>
								))}
							</div>
							{row['childs']?.value}
						</Fragment>
					))}
				</div>
			) : (
				<PageLoader />
			)}
			{(isLoading || !Boolean(resources.length)) && <EmptyCard />}
		</div>
	);
};
