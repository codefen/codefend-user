import type { Sort } from '@interfaces/table';
import { quickSort } from '@utils/sort.service';
import { useMemo } from 'react';

const filterRows = (rows: any[], term: string, initialOrder: string): any[] => {
  term = term.toLowerCase();

  return rows.filter(row => {
    const rowMatches: boolean = String(row[initialOrder] || '')
      .toLowerCase()
      .includes(term);

    const matchingChildren =
      row.childs?.filter((child: any) =>
        String(child[initialOrder] || '')
          .toLowerCase()
          .includes(term)
      ) || [];

    if (rowMatches || matchingChildren.length > 0) {
      row.childs = matchingChildren.length > 0 ? matchingChildren : row.childs;
      return true;
    }

    return false;
  });
};

const usePreProcessedRows = (
  rows: any[],
  initialOrder: string,
  sortedColumn: string,
  sort: Sort,
  term: string
) => {
  return useMemo(() => {
    const filteredRows = !term.trim() ? rows : filterRows(rows, term, initialOrder);
    return quickSort(filteredRows, sortedColumn, sort);
  }, [rows, sortedColumn, sort, term, initialOrder]);
};

export default usePreProcessedRows;
