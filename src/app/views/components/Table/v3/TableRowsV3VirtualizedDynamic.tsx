import { type ChangeEvent, type FC, type CSSProperties, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { type ColumnTableV3 } from '@interfaces/table.ts';
import { useTableStoreV3 } from './tablev3.store';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import TableLabelRow from './TableLabelRow';
import TableAnchorRow from './TableAnchorRow';
import TableSimpleRow from './TableSimpleRow';
import { useStableKeys } from '../../../../data/hooks/table/useStableKeys';
import type { TableRowsVirtualizedDynamicProps } from './types';

const TableRowsV3VirtualizedDynamic: FC<TableRowsVirtualizedDynamicProps> = ({
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
  rowHeight = 60,
  containerHeight = '100%',
}) => {
  // Hook para generar keys estables
  const getStableKey = useStableKeys(rows, 'dynamic-row');

  // Memoizar valores costosos
  const memoizedValues = useMemo(() => {
    const flattenedLength = rows.length;
    const hasFlattenedRows = Boolean(flattenedLength);

    return {
      flattenedLength,
      hasFlattenedRows,
    };
  }, [rows]);

  // Util para el multi select store
  const { selectedItems, setSelectedItems, removeItem, selectingActive, setActiveSelecting } =
    useTableStoreV3();

  // Maneja el checked de una fila
  const handleChecked = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
    },
    [setSelectedItems, removeItem, selectingActive, setActiveSelecting]
  );

  // Función para renderizar una fila individual
  const renderRow = useCallback(
    (index: number, style: CSSProperties) => {
      const row = rows[index];
      if (!row) return null;

      const itemDisable = ` ${isActiveDisable && row[TABLE_KEYS.COUNT_ISSUE] && row[TABLE_KEYS.COUNT_ISSUE] <= 0 ? 'item-disabled' : ''}`;
      const nextRow = rows[index + 1];

      // Generar key estable usando el hook
      const uniqueKey = getStableKey(row, index);

      // Validar que las props necesarias estén presentes
      if (!columns || !Array.isArray(columns)) {
        // console.error('Invalid columns prop in virtualized table');
        return null;
      }

      // Cuando la ROW es una URL
      if (urlNav) {
        return (
          <div style={style} key={uniqueKey}>
            <TableAnchorRow
              columns={columns}
              itemDisable={itemDisable}
              row={row}
              nextRow={nextRow}
              urlNav={urlNav}
              onContextMenu={onContextMenu}
              enableContextMenu={enableContextMenu}
              onThreeDotsClick={onThreeDotsClick}
            />
          </div>
        );
      }
      // Cuando la ROW tiene que tener el multiple select activo
      else if (isNeedMultipleCheck) {
        return (
          <div style={style} key={uniqueKey}>
            <TableLabelRow
              columns={columns}
              itemDisable={itemDisable}
              row={row}
              nextRow={nextRow}
              selectedItems={selectedItems}
              handleChecked={handleChecked}
              onContextMenu={onContextMenu}
              enableContextMenu={enableContextMenu}
              onThreeDotsClick={onThreeDotsClick}
            />
          </div>
        );
      }
      // Cuando la ROW es una row normal cae aca
      else {
        return (
          <div style={style} key={uniqueKey}>
            <TableSimpleRow
              columns={columns}
              itemDisable={itemDisable}
              row={row}
              nextRow={nextRow}
              action={action}
              selected={selected}
              selectedKey={selectedKey}
              onContextMenu={onContextMenu}
              enableContextMenu={enableContextMenu}
              onThreeDotsClick={onThreeDotsClick}
            />
          </div>
        );
      }
    },
    [
      rows,
      getStableKey,
      isActiveDisable,
      columns,
      urlNav,
      isNeedMultipleCheck,
      selectedItems,
      handleChecked,
      action,
      selected,
      selectedKey,
      onContextMenu,
      enableContextMenu,
      onThreeDotsClick,
    ]
  );

  // Si no hay filas, retornar null
  if (!memoizedValues.hasFlattenedRows) {
    return null;
  }

  // Validar props críticas
  if (!rowHeight || rowHeight <= 0) {
    // console.error('Invalid rowHeight in virtualized table:', rowHeight);
    return null;
  }

  return (
    <div style={{ height: containerHeight, width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => {
          // Validar dimensiones
          if (!height || !width || height <= 0 || width <= 0) {
            return <div style={{ height, width }} />;
          }

          return (
            <List
              height={height}
              width={width}
              itemCount={memoizedValues.flattenedLength}
              itemSize={rowHeight}
              overscanCount={5}>
              {({ index, style }) => renderRow(index, style)}
            </List>
          );
        }}
      </AutoSizer>
    </div>
  );
};

export default TableRowsV3VirtualizedDynamic;
