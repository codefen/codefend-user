import type { ColumnTableV3, Sort } from '@interfaces/table';
import { quickSort } from '@utils/sort.service';
import { useMemo } from 'react';

const filterRows = (
  rows: any[],
  term: string,
  initialOrder: string,
  columns: ColumnTableV3[]
): any[] => {
  if (!term.trim()) return rows;

  term = term.toLowerCase();
  const visibleKeys = new Set(columns.map(col => col.key));

  return rows
    .map(row => {
      const rowValues = Object.entries(row)
        .filter(([key]) => visibleKeys.has(key))
        .map(([, val]) => String(val || '').toLowerCase());

      const rowMatches = rowValues.some(value => value.includes(term));

      const matchingChildren =
        row.childs?.filter((child: any) =>
          Object.entries(child)
            .filter(([key]) => visibleKeys.has(key))
            .some(([, val]) =>
              String(val || '')
                .toLowerCase()
                .includes(term)
            )
        ) || [];

      if (rowMatches || matchingChildren.length > 0) {
        return {
          ...row,
          childs: matchingChildren.length > 0 ? matchingChildren : row.childs,
        };
      }

      return null;
    })
    .filter(Boolean);
};

const usePreProcessedRows = (
  rows: any[],
  initialOrder: string,
  sortedColumn: string,
  sort: Sort,
  term: string,
  isNeedSort: boolean,
  columns: ColumnTableV3[]
) => {
  return useMemo(() => {
    // Validaciones tempranas para evitar procesamiento innecesario
    if (!rows || rows.length === 0) {
      return [];
    }

    if (!columns || columns.length === 0) {
      return rows;
    }

    // Filtrar primero
    const filteredRows = filterRows(rows, term, initialOrder, columns);

    // Si no hay filas después del filtrado, retornar array vacío
    if (filteredRows.length === 0) {
      return [];
    }

    // Aplicar sorting solo si es necesario y hay una columna válida
    if (isNeedSort && sortedColumn && sortedColumn.trim() !== '') {
      try {
        return quickSort(filteredRows, sortedColumn, sort);
      } catch (error) {
        console.error('Error during sorting:', error);
        return filteredRows; // Retornar filas sin ordenar en caso de error
      }
    }

    return filteredRows;
  }, [rows, sortedColumn, sort, term, initialOrder, isNeedSort, columns]);
};

export default usePreProcessedRows;
