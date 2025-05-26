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
import TableColumnsV3 from './TableColumnsV3';
import TableRowsV3 from './TableRowsV3';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { MagnifyingGlassIcon } from '@icons';
import { useMultipleSelect } from '@hooks/table/useMultipleSelect';
import './tablev3.scss';
import { isShallowEqual } from '@utils/helper';
import Show from '@/app/views/components/Show/Show';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import EmptyCard from '@/app/views/components/EmptyCard/EmptyCard';

interface ContextMenuAction {
  label: string;
  icon?: ReactNode;
  onClick: (row: any) => void;
  disabled?: boolean | ((row: any) => boolean);
  divider?: boolean;
}

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
  isNeedSort?: boolean;
  limit?: number;
  action?: (val?: any) => void;
  selected?: any;
  selectedKey?: string;
  enableContextMenu?: boolean;
  contextMenuActions?: ContextMenuAction[];
  emptyInfo?: string | ReactNode;
  emptyTitle?: string;
  emptyIcon?: ReactNode;
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
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [hasScroll, setHasScroll] = useState(false);
  // Estado para manejar el ordenamiento
  const [sort, setSort] = useState<Sort>(initialSort);
  // Estado para indicar en base a que columna ordena
  const [sortedColumn, setDataSort] = useState<string>(columns[0].key);
  // Termino de busqueda (Solo cuando el buscador este activo)
  const [term, setTerm] = useState<string>('');
  // Estado para el menú contextual
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    row: any;
  }>({
    visible: false,
    x: 0,
    y: 0,
    row: null,
  });

  // Valores para manejar el selector multiple
  const {
    tableRef,
    isSelecting,
    isMoving,
    selectionBoxStyle,
    onPointerStop,
    onPointerMove,
    onPointerDown,
  } = useMultipleSelect(isNeedMultipleCheck);

  // hook for preprocessing data, sorting / filtering
  const preProcessedRows = usePreProcessedRows(
    rows,
    initialOrder,
    sortedColumn,
    sort,
    term,
    isNeedSort,
    columns
  );

  // I memorize the classes of the table
  const tableClassName = useMemo(
    () =>
      `table ${className} ${isSelecting ? 'table-item-no-selected' : ''} ${isMoving ? ' table-item-no-ev' : ''} ${enableContextMenu ? 'table-context-menu-enabled' : ''}`,
    [className, isSelecting, isMoving, enableContextMenu]
  );

  // Manejador del click derecho
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

  // Cerrar el menú contextual
  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  // Manejar click fuera del menú contextual
  const handleClickOutside = useCallback(
    (event: any) => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    },
    [contextMenu.visible, closeContextMenu]
  );

  // Manejar scroll para cerrar el menú contextual
  const handleScroll = useCallback(() => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
  }, [contextMenu.visible, closeContextMenu]);

  // Efecto para manejar el click fuera del menú
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    const el = rowRef.current as HTMLDivElement;
    let resizeObserver: ResizeObserver | null = null;
    if (el) {
      const checkScroll = () => setHasScroll(el.scrollHeight > el.clientHeight);
      checkScroll(); // inicial
      // Si el contenido puede cambiar dinámicamente, escucha resize/mutaciones:
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
  }, [handleClickOutside, handleScroll, rows.length, rowRef.current]);

  // Manejador del click en el botón de tres puntos
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

  return (
    <div className="table-group">
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
        style={{ '--cell-count': columns.length - 1 } as any}
        ref={tableRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerStop}
        onPointerCancel={onPointerStop}>
        {isMoving && <div className="selecting-box" style={selectionBoxStyle} />}
        <Show when={Boolean(preProcessedRows.length)}>
          <TableColumnsV3
            columns={columns}
            sortedColumn={sortedColumn}
            sort={sort}
            setSort={setSort}
            setSortColumn={setDataSort}
            isNeedMultipleCheck={isNeedMultipleCheck}
            isNeedSort={isNeedSort}
          />
        </Show>

        <Show when={showRows} fallback={<PageLoader />}>
          <div className={`rows ${hasScroll ? 'rows-with-scroll' : ''}`} ref={rowRef}>
            <TableRowsV3
              columns={columns}
              rows={preProcessedRows}
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
        </Show>
        <Show when={showRows && !Boolean(preProcessedRows.length)}>
          <EmptyCard info={emptyInfo} title={emptyTitle} icon={emptyIcon} />
        </Show>

        {/* Context Menu */}
        <Show when={contextMenu.visible}>
          <div
            className=" card table-context-menu"
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 1000,
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
          </div>
        </Show>
      </div>
    </div>
  );
};

const areEqual = (prevProps: Tablev3Props<any>, nextProps: Tablev3Props<any>) => {
  return isShallowEqual(prevProps, nextProps, { rows: isShallowEqual });
};

export default memo(Tablev3, areEqual);
