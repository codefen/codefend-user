import type { ColumnTableV3, Sort } from '@interfaces/table';
import { quickSort } from '@utils/sort.service';
import { useMemo } from 'react';

const filterRows = (
  rows: any[],
  term: string,
  initialOrder: string,
  columns: ColumnTableV3[]
): any[] => {
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
    const filteredRows = !term.trim() ? rows : filterRows(rows, term, initialOrder, columns);
    const sorted = isNeedSort ? quickSort(filteredRows, sortedColumn, sort) : filteredRows;
    return sorted;
  }, [rows, sortedColumn, sort, term, initialOrder]);
};

export default usePreProcessedRows;
