import { type ChangeEvent, type FC, type ReactNode, type MouseEvent } from 'react';
import { type ColumnTableV3 } from '@interfaces/table.ts';
import { useTableStoreV3 } from './tablev3.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import TableLabelRow from './TableLabelRow';
import TableAnchorRow from './TableAnchorRow';
import TableSimpleRow from './TableSimpleRow';
import { generateID } from '@utils/helper';
import type { TableRowsProps } from './types';

const TableRowsV3: FC<TableRowsProps> = ({
  rows, // Filas ya flattenadas
  columns,
  urlNav,
  isActiveDisable,
  isNeedMultipleCheck,
  limit,
  action,
  selected,
  selectedKey,
  onContextMenu,
  enableContextMenu,
  onThreeDotsClick,
}) => {
  // Util para el multi select store
  const { selectedItems, setSelectedItems, removeItem, selectingActive, setActiveSelecting } =
    useTableStoreV3();
  // Maneja el checked de una fila
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

  // Define cual tupo de row debe de renderizar
  const getRows = (r: any[]) => {
    let rows: ReactNode[] = [];
    const rowCount = r.length;
    for (let i = 0; i < rowCount; i++) {
      const row = r[i] as any;
      const itemDisable = ` ${isActiveDisable && row[TABLE_KEYS.COUNT_ISSUE] && row[TABLE_KEYS.COUNT_ISSUE] <= 0 ? 'item-disabled' : ''}`;

      // Generar key única para cada fila
      const rowId = row?.[TABLE_KEYS.ID];
      const uniqueKey = rowId ? `${rowId}-${i}` : `row-${i}-${generateID()}`;

      // Cuando la ROW es una URL
      if (urlNav) {
        rows[i] = (
          <TableAnchorRow
            key={uniqueKey}
            columns={columns}
            itemDisable={itemDisable}
            row={row}
            nextRow={r?.[i + 1]}
            urlNav={urlNav}
            onContextMenu={onContextMenu}
            enableContextMenu={enableContextMenu}
            onThreeDotsClick={onThreeDotsClick}
          />
        );
      }
      // Cuando la ROW tiene que tener el multiple select activo
      else if (isNeedMultipleCheck) {
        rows[i] = (
          <TableLabelRow
            key={uniqueKey}
            columns={columns}
            itemDisable={itemDisable}
            row={row}
            nextRow={r?.[i + 1]}
            selectedItems={selectedItems}
            handleChecked={handleChecked}
            onContextMenu={onContextMenu}
            enableContextMenu={enableContextMenu}
            onThreeDotsClick={onThreeDotsClick}
          />
        );
      }
      // Cuando la ROW es una row normal cae aca
      else {
        rows[i] = (
          <TableSimpleRow
            key={uniqueKey}
            columns={columns}
            itemDisable={itemDisable}
            row={row}
            nextRow={r?.[i + 1]}
            action={action}
            selected={selected}
            selectedKey={selectedKey}
            onContextMenu={onContextMenu}
            enableContextMenu={enableContextMenu}
            onThreeDotsClick={onThreeDotsClick}
          />
        );
      }
    }
    return rows;
  };

  return getRows(rows);
};

export default TableRowsV3;
