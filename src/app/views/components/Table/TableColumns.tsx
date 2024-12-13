import { type FC } from 'react';
import { type ColumnTable, Sort } from '@interfaces/table.ts';

interface TableColumnsProps {
  columns: ColumnTable[];
  dataSort: string;
  sortDirection: Sort;
  updateSortData: (updated: string) => void;
  updateDirection: (updated: Sort) => void;
}

const TableColumns: FC<TableColumnsProps> = ({
  dataSort,
  sortDirection,
  columns,
  updateDirection,
  updateSortData,
}) => {
  const handleSort = (cn: string, cds: string, cs: Sort) => {
    if (cn === cds) {
      updateDirection(cs === Sort.asc ? Sort.desc : Sort.asc);
    } else {
      updateSortData(cn);
      updateDirection(Sort.asc);
    }
  };
  const onClickColumn = (column: string) => {
    if (column === 'action') return;
    handleSort(column, dataSort, sortDirection);
  };

  const isAsc = sortDirection === Sort.asc;
  return (
    <div className="columns-name">
      {columns.map((column: ColumnTable, i: number) => (
        <div
          className={`column ${column?.style}`}
          key={`c-${i}`}
          onClick={() => onClickColumn(column.name)}>
          {column.value}
          {dataSort === column.name && <span className="sort">{isAsc ? '↑' : '↓'}</span>}
        </div>
      ))}
    </div>
  );
};

export default TableColumns;
