import { useState, type FC } from 'react';
import { RUNNING_DESKTOP, calculateRowCalcX, calculateRowSizeX } from '@utils/helper.ts';
import Show from '@/app/views/components/Show/Show';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import { type TableProps, Sort } from '@interfaces/table.ts';
// import './table.scss';
import TableColumns from './TableColumns';
import TableRows from './TableRows';

export const TableV2: FC<TableProps> = ({
  rowsData,
  columns,
  showRows,
  tableAction,
  showEmpty,
  isSmall = false,
  selectItem,
  sort = Sort.desc,
  sizeX = 100,
  urlNav,
  emptyInfo = '',
}) => {
  const [sortDirection, setSortDirection] = useState<Sort>(sort);
  const [dataSort, setDataSort] = useState<string>(columns[0]?.name || '');
  const [selectedField, setSelectedField] = useState('');
  const handleSelected = (e: any, key: string, ID: string, issueCount?: string | number) => {
    e.preventDefault();
    if (selectItem !== undefined) {
      selectItem(issueCount ? { issueCount, ID } : ID);
      return;
    }

    if (key === selectedField) {
      setSelectedField('');
    } else {
      setSelectedField(key);
    }
  };

  const urlForRowItem = RUNNING_DESKTOP() ? '' : urlNav || '';

  return (
    <div
      className={`table ${isSmall && 'small'} ${!tableAction && 'table-with-out-action'}`}
      style={
        {
          '--row-size-x': calculateRowSizeX(sizeX),
          '--row-calc-x': calculateRowCalcX(sizeX),
        } as any
      }>
      <TableColumns
        columns={columns}
        dataSort={dataSort}
        sortDirection={sortDirection}
        updateSortData={(updated: any) => setDataSort(updated)}
        updateDirection={(updated: any) => setSortDirection(updated)}
      />

      <Show when={showRows} fallback={<PageLoader />}>
        <TableRows
          rowsData={rowsData}
          columns={columns}
          sortDirection={sortDirection}
          dataSort={dataSort}
          tableAction={tableAction}
          urlNav={urlForRowItem}
          handleSelected={handleSelected}
          isActiveAction={!!tableAction}
          selectedField={selectedField}
        />
      </Show>
      <Show when={showEmpty}>
        <EmptyCard info={emptyInfo} />
      </Show>
    </div>
  );
};
