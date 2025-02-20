import { memo, useMemo, useState, type FC } from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import usePreProcessedRows from '@hooks/table/usePreprocesorRows';
import TableColumnsV3 from './TableColumnsV3';
import TableRowsV3 from './TableRowsV3';
import Show from '@/app/components/Show/Show';
import EmptyCard from '@defaults/EmptyCard';
import { PageLoader } from '@defaults/loaders/Loader';
import { ModalInput } from '@defaults/ModalInput';
import { MagnifyingGlassIcon } from '@icons';
import { useMultipleSelect } from '@hooks/table/useMultipleSelect';
import './tablev3.scss';
import { isShallowEqual } from '@utils/helper';

interface Tablev3Props<T> {
  rows: T[];
  columns: ColumnTableV3[];
  showRows: boolean;

  className?: string;
  initialSort?: Sort;
  initialOrder?: string;
  urlNav?: string;
  isActiveDisable?: boolean;
  isNeedMultipleCheck?: boolean;
  isNeedSearchBar?: boolean;
}

const Tablev3: FC<Tablev3Props<any>> = ({
  className = '',
  initialSort = Sort.asc,
  initialOrder = '',
  rows = [],
  columns,
  urlNav,
  showRows,
  isActiveDisable = false,
  isNeedMultipleCheck = false,
  isNeedSearchBar = false,
}) => {
  const [sort, setSort] = useState<Sort>(initialSort);
  const [sortedColumn, setDataSort] = useState<string>(columns[0].key);
  const [term, setTerm] = useState<string>('');
  const {
    tableRef,
    isSelecting,
    isMoving,
    selectionBoxStyle,
    onPointerStop,
    onPointerMove,
    onPointerDown,
  } = useMultipleSelect(isNeedMultipleCheck);
  const preProcessedRows = usePreProcessedRows(rows, initialOrder, sortedColumn, sort, term);
  const tableClassName = useMemo(
    () =>
      `table ${className} ${isSelecting ? 'table-item-no-selected' : ''} ${isMoving ? ' table-item-no-ev' : ''}`,
    [className, isSelecting, isMoving]
  );
  return (
    <div className="table-group">
      <Show when={isNeedSearchBar}>
        <div className="table-utils table-search-bar">
          <ModalInput
            icon={<MagnifyingGlassIcon />}
            setValue={(val: string) => setTerm(val)}
            placeholder="Search resource. . ."
          />
        </div>
      </Show>

      <div
        className={tableClassName}
        style={{ '--cell-count': columns.length - 1 } as any}
        ref={tableRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerStop}
        onPointerCancel={onPointerStop}>
        {isMoving && <div className="selecting-box" style={selectionBoxStyle} />}
        <TableColumnsV3
          columns={columns}
          sortedColumn={sortedColumn}
          sort={sort}
          setSort={setSort}
          setSortColumn={setDataSort}
          isNeedMultipleCheck={isNeedMultipleCheck}
        />

        <Show when={showRows} fallback={<PageLoader />}>
          <div className="rows">
            <TableRowsV3
              columns={columns}
              rows={preProcessedRows}
              urlNav={urlNav}
              isActiveDisable={isActiveDisable}
              isNeedMultipleCheck={isNeedMultipleCheck}
            />
          </div>
        </Show>
        <Show when={showRows && !Boolean(preProcessedRows.length)}>
          <EmptyCard />
        </Show>
      </div>
    </div>
  );
};

const areEqual = (prevProps: Tablev3Props<any>, nextProps: Tablev3Props<any>) => {
  return isShallowEqual(prevProps, nextProps, { rows: isShallowEqual });
};

export default memo(Tablev3, areEqual);
