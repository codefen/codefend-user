import { useMemo, type FC, type ReactNode } from 'react';
import { flattenRowsData, quickSort } from '@utils/helper.ts';
import { Sort, type ColumnTable, type TableAction, type TableItem } from '@interfaces/table.ts';
import Row from './Row';

interface TableRowsProps {
  rowsData: Record<string, TableItem>[];
  isActiveAction: boolean;
  columns: ColumnTable[];
  sortDirection: Sort;
  dataSort: string;
  tableAction?: TableAction;
  selectedField: string;
  urlNav?: string;
  handleSelected: (e: any, key: string, ID: string, issueCount?: string | number) => void;
}

const filterForRow = (columns: ColumnTable[], isActiveAction: boolean) => {
  const columnForRows: ColumnTable[] = [];
  for (const column of columns) {
    if (isActiveAction && column.name === 'action') {
      continue;
    }
    columnForRows.push(column);
  }
  return columnForRows;
};

const TableRows: FC<TableRowsProps> = ({
  rowsData,
  isActiveAction,
  columns,
  sortDirection,
  dataSort,
  tableAction,
  selectedField,
  urlNav,
  handleSelected,
}) => {
  // Aplicar sorting directamente sobre los datos originales para mantener la jerarquía
  const rows = useMemo(
    () => quickSort(rowsData.slice(), dataSort, sortDirection),
    [dataSort, sortDirection, rowsData]
  );
  const columnForRows = filterForRow(columns, isActiveAction);

  const handleClick = (e: any, key: string, rowId: any, issueCount?: string | number) =>
    handleSelected(e, key, rowId, issueCount);

  const getRows = (r: Record<string, TableItem>[]) => {
    let rows: ReactNode[] = [];
    const rowCount = r.length;
    for (let i = 0; i < rowCount; i++) {
      rows[i] = (
        <Row
          key={`row-${r[i]['ID'].value}-${i}`}
          row={r[i]}
          rowIndex={i}
          columns={columnForRows}
          urlNav={urlNav}
          selectedField={selectedField}
          handleClick={handleClick}
          isActiveAction={isActiveAction}
          tableAction={tableAction}
        />
      );
    }
    return rows;
  };

  return <div className="rows">{getRows(rows)}</div>;
};

export default TableRows;
