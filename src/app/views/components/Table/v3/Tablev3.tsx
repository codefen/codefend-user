import {
  memo,
  useMemo,
  useState,
  type FC,
  useCallback,
  useEffect,
  type MouseEvent,
  type ReactNode,
  useRef,
} from 'react';
import { Sort, type ColumnTableV3 } from '@interfaces/table';
import usePreProcessedRows from '@hooks/table/usePreprocesorRows';
import { useVirtualizedSorting, useSortingPerformance } from '@hooks/table/useVirtualizedSorting';
import { flattenRows } from '@utils/sort.service';
import TableColumnsV3 from './TableColumnsV3';
import TableRowsV3 from './TableRowsV3';
import TableRowsV3VirtualizedDynamic from './TableRowsV3VirtualizedDynamic';
import TableSkeleton from './TableSkeleton';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { MagnifyingGlassIcon } from '@icons';
import { useMultipleSelect } from '@hooks/table/useMultipleSelect';
import { useVirtualizationConfig } from '@hooks/table/useVirtualizationConfig';
import './tablev3.scss';
import { isShallowEqual } from '@utils/helper';
import Show from '@/app/views/components/Show/Show';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';
import { createPortal } from 'react-dom';
import type { Tablev3Props, ContextMenuState, MemoizedValues } from './types';

const root = document.getElementById('root-modal');

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
  limit = 0,
  isNeedSort = true,
  action,
  selected,
  selectedKey,
  enableContextMenu = false,
  contextMenuActions = [],
  emptyInfo = '',
  emptyTitle = "There's no data to display here",
  emptyIcon,
  enableVirtualization = false,
  rowHeight = 60,
  containerHeight: propContainerHeight,
  virtualizationThreshold = 100,
  enableSortingPerformance = false,
  enableOptimisticSorting = true,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [sort, setSort] = useState<Sort>(initialSort);
  const [sortedColumn, setDataSort] = useState<string>(columns[0]?.key || '');
  const [term, setTerm] = useState<string>('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    row: null,
  });

  const {
    tableRef,
    isSelecting,
    isMoving,
    selectionBoxStyle,
    onPointerStop,
    onPointerMove,
    onPointerDown,
  } = useMultipleSelect(isNeedMultipleCheck);

  const preProcessedRows = usePreProcessedRows(
    rows,
    initialOrder,
    sortedColumn,
    sort,
    term,
    isNeedSort,
    columns
  );

  const virtualizedSortingResult = useVirtualizedSorting({
    rows,
    sortedColumn,
    sort,
    isNeedSort,
    limit,
    columns,
    term,
    enableOptimisticSorting,
  });

  const { logPerformance } = useSortingPerformance(virtualizedSortingResult);

  const finalRows = enableVirtualization ? virtualizedSortingResult.sortedRows : preProcessedRows;
  const flattenedRows = enableVirtualization
    ? virtualizedSortingResult.flattenedRows
    : useMemo(() => {
        try {
          return flattenRows(preProcessedRows, limit);
        } catch (error) {
          console.error('Error flattening rows:', error);
          return preProcessedRows;
        }
      }, [preProcessedRows, limit]);

  const memoizedValues: MemoizedValues = useMemo(() => {
    const flattenedLength = flattenedRows.length;
    const hasFlattenedRows = virtualizedSortingResult.showSkeleton || Boolean(flattenedLength);
    const columnsCount = columns.length;

    return {
      flattenedLength,
      hasFlattenedRows,
      columnsCount,
      cellCount: columnsCount - 1,
    };
  }, [flattenedRows, columns, virtualizedSortingResult.showSkeleton]);

  const virtualizationConfig = useVirtualizationConfig({
    containerRef: tableContainerRef,
    rowHeight,
    minContainerHeight: 200,
    maxContainerHeight: typeof propContainerHeight === 'number' ? propContainerHeight : 600,
  });

  const shouldUseVirtualization = useMemo(() => {
    if (!enableVirtualization) return false;
    if (propContainerHeight) {
      return virtualizedSortingResult.totalRowCount >= virtualizationThreshold;
    }
    return virtualizationConfig.shouldUseVirtualization;
  }, [
    enableVirtualization,
    virtualizedSortingResult.totalRowCount,
    virtualizationThreshold,
    propContainerHeight,
    virtualizationConfig.shouldUseVirtualization,
  ]);

  useEffect(() => {
    if (!propContainerHeight || typeof propContainerHeight === 'string') {
      virtualizationConfig.updateVirtualizationConfig(virtualizedSortingResult.totalRowCount);
    }
  }, [virtualizedSortingResult.totalRowCount, propContainerHeight, virtualizationConfig]);

  useEffect(() => {
    if (enableSortingPerformance && shouldUseVirtualization) {
      logPerformance();
    }
  }, [enableSortingPerformance, shouldUseVirtualization, logPerformance]);

  const handleSortChange = useCallback((newSort: Sort, newColumn?: string) => {
    if (newColumn) {
      setSort(newSort);
      setDataSort(newColumn);
    } else {
      setSort(newSort);
    }
  }, []);

  const handleColumnChange = useCallback((newColumn: string) => {
    setDataSort(newColumn);
    setSort(Sort.asc);
  }, []);

  const tableClassName = useMemo(
    () =>
      `table ${className} ${isSelecting ? 'table-item-no-selected' : ''} ${isMoving ? ' table-item-no-ev' : ''} ${enableContextMenu ? 'table-context-menu-enabled' : ''} ${shouldUseVirtualization ? 'table-virtualized' : ''}`,
    [className, isSelecting, isMoving, enableContextMenu, shouldUseVirtualization]
  );

  const handleContextMenu = useCallback(
    (event: any, row: any) => {
      if (!enableContextMenu) return;
      event.preventDefault();
      event.stopPropagation();
      if (!contextMenuActions.length) return;

      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        row,
      });
    },
    [enableContextMenu, contextMenuActions]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleClickOutside = useCallback(
    (event: any) => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    },
    [contextMenu.visible, closeContextMenu]
  );

  const handleScroll = useCallback(() => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
  }, [contextMenu.visible, closeContextMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);

    if (!shouldUseVirtualization) {
      const el = rowRef.current as HTMLDivElement;
      let resizeObserver: ResizeObserver | null = null;
      if (el) {
        const checkScroll = () => setHasScroll(el.scrollHeight > el.clientHeight);
        checkScroll();
        resizeObserver = new ResizeObserver(checkScroll);
        resizeObserver.observe(el);
      }

      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
      };
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleClickOutside, handleScroll, shouldUseVirtualization]);

  const handleThreeDotsClick = useCallback(
    (event: MouseEvent, row: any) => {
      event.preventDefault();
      event.stopPropagation();
      if (!contextMenuActions.length) return;

      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        row,
      });
    },
    [contextMenuActions]
  );

  const getContainerHeight = useCallback(() => {
    if (typeof propContainerHeight === 'string') {
      return propContainerHeight;
    }
    return propContainerHeight ? `${propContainerHeight}px` : '100%';
  }, [propContainerHeight]);

  return (
    <div className="table-group" ref={tableContainerRef}>
      <Show when={isNeedSearchBar}>
        <div className="table-search-bar">
          <ModalInput
            icon={<MagnifyingGlassIcon />}
            setValue={(val: string) => setTerm(val)}
            placeholder="Search resource. . ."
          />
        </div>
      </Show>

      <div
        className={tableClassName}
        style={{ '--cell-count': memoizedValues.cellCount } as any}
        ref={tableRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerStop}
        onPointerCancel={onPointerStop}>
        {isMoving && <div className="selecting-box" style={selectionBoxStyle} />}
        <Show when={memoizedValues.hasFlattenedRows}>
          <TableColumnsV3
            columns={columns}
            sortedColumn={sortedColumn}
            sort={sort}
            setSort={handleSortChange}
            setSortColumn={handleColumnChange}
            isNeedMultipleCheck={isNeedMultipleCheck}
            isNeedSort={isNeedSort}
            onSortStart={virtualizedSortingResult.activateSkeleton}
          />
        </Show>

        <Show when={showRows} fallback={<PageLoader />}>
          <div className="table-rows-container" style={{ position: 'relative' }}>
            {virtualizedSortingResult.showSkeleton &&
              rows.length > 0 &&
              virtualizedSortingResult.totalRowCount > 500 && (
                <TableSkeleton
                  totalRowCount={virtualizedSortingResult.totalRowCount}
                  rowsLength={rows.length}
                  isNeedMultipleCheck={isNeedMultipleCheck}
                  columns={columns}
                />
              )}

            {shouldUseVirtualization ? (
              <div className="rows-virtualized-dynamic">
                <TableRowsV3VirtualizedDynamic
                  columns={columns}
                  rows={flattenedRows}
                  urlNav={urlNav}
                  isActiveDisable={isActiveDisable}
                  isNeedMultipleCheck={isNeedMultipleCheck}
                  limit={limit}
                  action={action}
                  selected={selected}
                  selectedKey={selectedKey}
                  onContextMenu={handleContextMenu}
                  enableContextMenu={enableContextMenu}
                  onThreeDotsClick={handleThreeDotsClick}
                  rowHeight={rowHeight}
                  containerHeight={getContainerHeight()}
                />
              </div>
            ) : (
              <div className={`rows ${hasScroll ? 'rows-with-scroll' : ''}`} ref={rowRef}>
                <TableRowsV3
                  columns={columns}
                  rows={flattenedRows}
                  urlNav={urlNav}
                  isActiveDisable={isActiveDisable}
                  isNeedMultipleCheck={isNeedMultipleCheck}
                  limit={limit}
                  action={action}
                  selected={selected}
                  selectedKey={selectedKey}
                  onContextMenu={handleContextMenu}
                  enableContextMenu={enableContextMenu}
                  onThreeDotsClick={handleThreeDotsClick}
                />
              </div>
            )}
          </div>
        </Show>
        <Show
          when={
            showRows && !memoizedValues.hasFlattenedRows && !virtualizedSortingResult.showSkeleton
          }>
          <EmptyCard info={emptyInfo} title={emptyTitle} icon={emptyIcon} />
        </Show>

        <Show when={contextMenu.visible}>
          {createPortal(
            <div
              className="card table-context-menu"
              style={{
                top: contextMenu.y,
                left: contextMenu.x,
              }}>
              {contextMenuActions.map((action, index) => (
                <div key={index}>
                  {action.divider && <div className="context-menu-divider" />}
                  <button
                    className={`context-menu-item ${typeof action.disabled === 'function' ? (action.disabled(contextMenu.row) ? 'disabled' : '') : action.disabled ? 'disabled' : ''}`}
                    onClick={() => {
                      if (
                        typeof action.disabled === 'function'
                          ? action.disabled(contextMenu.row)
                            ? false
                            : true
                          : action.disabled
                            ? false
                            : true
                      ) {
                        action.onClick(contextMenu.row);
                        closeContextMenu();
                      }
                    }}
                    disabled={
                      typeof action.disabled === 'function'
                        ? action.disabled(contextMenu.row)
                        : action.disabled
                    }>
                    {action.icon && <span className="context-menu-icon">{action.icon}</span>}
                    <span className="context-menu-label">{action.label}</span>
                  </button>
                </div>
              ))}
            </div>,
            root as HTMLElement
          )}
        </Show>
      </div>
    </div>
  );
};

const areEqual = (prevProps: Tablev3Props<any>, nextProps: Tablev3Props<any>) => {
  return isShallowEqual(prevProps, nextProps, { rows: isShallowEqual });
};

export default memo(Tablev3, areEqual);
