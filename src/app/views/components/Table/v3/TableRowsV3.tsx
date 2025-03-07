import { type ChangeEvent, type FC, type ReactNode } from 'react';
import { type ColumnTableV3 } from '@interfaces/table.ts';
import { flattenRows } from '@utils/sort.service';
import { useTableStoreV3 } from './tablev3.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import TableLabelRow from './TableLabelRow';
import TableAnchorRow from './TableAnchorRow';
import TableSimpleRow from './TableSimpleRow';

interface TableRowsProps {
  rows: any[];
  columns: ColumnTableV3[];
  urlNav?: string;
  isActiveDisable: boolean;
  isNeedMultipleCheck: boolean;
  limit: number;
}

const TableRowsV3: FC<TableRowsProps> = ({
  rows,
  columns,
  urlNav,
  isActiveDisable,
  isNeedMultipleCheck,
  limit,
}) => {
  const flattenedRows = flattenRows(rows, limit);
  const { selectedItems, setSelectedItems, removeItem, selectingActive, setActiveSelecting } =
    useTableStoreV3();
  //const handleClick = (e: any, item: any) => {};
  const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { value, checked } = e.target;
    if (checked) {
      setSelectedItems(value);
    } else if (!checked) {
      if (!selectingActive) {
        removeItem(value);
      } else {
        setActiveSelecting(false);
      }
    }
  };

  const getRows = (r: any[]) => {
    let rows: ReactNode[] = [];
    const rowCount = r.length;
    for (let i = 0; i < rowCount; i++) {
      const row = r[i] as any;
      const itemDisable = ` ${isActiveDisable && row[TABLE_KEYS.COUNT_ISSUE] && row[TABLE_KEYS.COUNT_ISSUE] <= 0 ? 'item-disabled' : ''}`;
      if (urlNav) {
        const key = row?.[TABLE_KEYS.ID];
        rows[i] = (
          <TableAnchorRow
            key={key ? key + i : crypto.randomUUID()}
            columns={columns}
            itemDisable={itemDisable}
            row={row}
            nextRow={r?.[i + 1]}
            urlNav={urlNav}
          />
        );
      } else if (isNeedMultipleCheck) {
        const key = row?.[TABLE_KEYS.ID];
        rows[i] = (
          <TableLabelRow
            key={key ? key + i : crypto.randomUUID()}
            columns={columns}
            itemDisable={itemDisable}
            row={row}
            nextRow={r?.[i + 1]}
            selectedItems={selectedItems}
            handleChecked={handleChecked}
          />
        );
      } else {
        const key = row?.[TABLE_KEYS.ID];
        rows[i] = (
          <TableSimpleRow
            key={key ? key + i : crypto.randomUUID()}
            columns={columns}
            itemDisable={itemDisable}
            row={row}
            nextRow={r?.[i + 1]}
          />
        );
      }
    }
    return rows;
  };

  return getRows(flattenedRows);
};

export default TableRowsV3;
