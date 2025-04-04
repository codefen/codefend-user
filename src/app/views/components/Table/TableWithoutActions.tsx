import React, { Fragment, type ReactNode } from 'react';
import { formatDate } from '@utils/helper';
import type { ColumnTable, TableItem } from '@interfaces/table';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';

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
  const ColumnActive: React.FC<any> = props => {
    if (props.column.name != 'childs') {
      return (
        <div className={`${props.row[props.column.name as keyof typeof props.row]?.style}`}>
          {props.column.name !== 'published'
            ? props.row[props.column.name as keyof typeof props.row]?.value
            : formatDate(String(props.row[props.column.name as keyof typeof props.row]?.value))}
        </div>
      );
    }

    return <></>;
  };

  const rows = resources ? resources : [];
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
          {rows.map((row: Record<string, TableItem>, i: number) => (
            <Fragment key={i + id + '-row'}>
              <div className={`item ${needMarker && 'left-marked'}`}>
                {columns.map((column: ColumnTable, i: number) => (
                  <ColumnActive key={i + id + '-i'} column={column} row={row} />
                ))}
              </div>
              {row['childs']?.value as ReactNode}
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
