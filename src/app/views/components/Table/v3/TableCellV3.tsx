import type { ColumnTableV3 } from '@interfaces/table';
import { useMemo, type CSSProperties, type FC } from 'react';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import type { TableCellProps } from './types';

const TableCellV3: FC<TableCellProps> = ({ row, columns, nextRow }) => {
  const renderContent = useMemo(() => {
    return columns.map((column, i) => (
      <div
        key={`ric-${i}`}
        className={`item-cell ${column.styles}`}
        style={
          {
            '--cell-expand': column.weight,
          } as CSSProperties
        }>
        {column.render(
          !column?.type?.startsWith(TABLE_KEYS.FULL_ROW) ? row[column.key] : row,
          column?.type === TABLE_KEYS.FULL_WITH_NEXT ? nextRow : null
        )}
      </div>
    ));
  }, [row, nextRow]);

  return renderContent;
};

export default TableCellV3;
