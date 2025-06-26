import { memo, useCallback, type FC, type ReactNode } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';
import type { TableColumnsV3Props } from './types';

const TableColumnsV3: FC<TableColumnsV3Props> = ({
  columns,
  sortedColumn,
  sort,
  setSort,
  setSortColumn,
  isNeedMultipleCheck = false,
  isNeedSort = true,
  onSortStart,
}) => {
  const handleSortClick = useCallback(
    (column: string) => {
      if (column === TABLE_KEYS.ACTION || !isNeedSort) return;

      onSortStart?.();

      if (sortedColumn === column) {
        // Misma columna: cambiar dirección
        const newSort = sort === Sort.asc ? Sort.desc : Sort.asc;
        setSort(newSort);
      } else {
        // Nueva columna: cambiar columna y resetear a ascendente
        setSortColumn(column);
      }
    },
    [sortedColumn, sort, isNeedSort, setSort, setSortColumn, onSortStart]
  );

  const getSortIcon = (column: string) => {
    if (column !== sortedColumn) return null;

    return <span className="sort-icon">{sort === Sort.asc ? '↑' : '↓'}</span>;
  };

  return (
    <div className="table-header">
      <Show when={isNeedMultipleCheck}>
        <div className="column-header checkbox-header">
          <input type="checkbox" />
        </div>
      </Show>

      {columns.map((column, i) => (
        <div
          key={`cv3-${i}`}
          className={`column-header item-cell ${column.styles} ${column.key === sortedColumn ? 'sorted' : ''}`}
          style={{ '--cell-expand': column.weight } as any}
          onClick={() => handleSortClick(column.key)}>
          <div className="column-content">
            {column.header}
            {getSortIcon(column.key)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(TableColumnsV3);
