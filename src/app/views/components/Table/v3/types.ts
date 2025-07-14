import {
  type ReactNode,
  type MouseEvent,
  type ChangeEvent,
  type CSSProperties,
  type RefObject,
} from 'react';
import { type ColumnTableV3, type Sort } from '@interfaces/table';
import type { ContextMenuAction, ContextMenuState } from '@/app/views/components/ContextMenu';

// ============================================================================
// MAIN TABLE COMPONENT TYPES
// ============================================================================

export interface Tablev3Props<T = any> {
  rows: T[];
  columns: ColumnTableV3[];
  showRows?: boolean;
  showSkeleton?: boolean;
  totalRowCount?: number;
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
  enableVirtualization?: boolean;
  rowHeight?: number;
  containerHeight?: number | string;
  virtualizationThreshold?: number;
  enableSortingPerformance?: boolean;
  enableOptimisticSorting?: boolean;
}

// Re-export types for backward compatibility
export type { ContextMenuAction, ContextMenuState };

// ============================================================================
// COLUMNS COMPONENT TYPES
// ============================================================================

export interface TableColumnsV3Props {
  columns: ColumnTableV3[];
  sortedColumn: string;
  sort: Sort;
  setSort: (sort: Sort) => void;
  setSortColumn: (column: string) => void;
  isNeedMultipleCheck?: boolean;
  isNeedSort?: boolean;
  onSortStart?: () => void;
}

// ============================================================================
// ROWS COMPONENT TYPES
// ============================================================================

export interface TableRowsProps {
  rows: any[]; // Filas ya flattenadas
  columns: ColumnTableV3[];
  urlNav?: string;
  isActiveDisable: boolean;
  isNeedMultipleCheck: boolean;
  limit: number;
  action?: (val?: any) => void;
  selected?: any;
  selectedKey?: string;
  onContextMenu?: (event: MouseEvent, row: any) => void;
  enableContextMenu?: boolean;
  onThreeDotsClick?: (event: MouseEvent, row: any) => void;
}

export interface TableRowsVirtualizedDynamicProps extends TableRowsProps {
  rowHeight?: number;
  containerHeight?: string; // CSS height value like "calc(100cqh - 115px)"
}

// ============================================================================
// ROW COMPONENT TYPES
// ============================================================================

export interface BaseRowProps {
  itemDisable: string;
  row: any;
  nextRow?: any;
  columns: ColumnTableV3[];
  onContextMenu?: (event: MouseEvent, row: any) => void;
  enableContextMenu?: boolean;
  onThreeDotsClick?: (event: MouseEvent, row: any) => void;
}

export interface TableLabelRowProps extends BaseRowProps {
  selectedItems: Readonly<string[]>;
  handleChecked: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface TableAnchorRowProps extends BaseRowProps {
  urlNav?: string;
}

export interface TableSimpleRowProps extends BaseRowProps {
  action?: (val?: any) => void;
  selected?: any;
  selectedKey?: string;
}

// ============================================================================
// CELL COMPONENT TYPES
// ============================================================================

export interface TableCellProps {
  row: any;
  nextRow?: any;
  columns: ColumnTableV3[];
}

// ============================================================================
// VIRTUALIZATION TYPES
// ============================================================================

export interface UseVirtualizationConfigProps {
  containerRef: RefObject<HTMLDivElement | null>;
  rowHeight: number;
  minContainerHeight?: number;
  maxContainerHeight?: number;
}

export interface VirtualizationConfig {
  containerHeight: number;
  rowHeight: number;
  shouldUseVirtualization: boolean;
  estimatedRowCount: number;
  updateVirtualizationConfig: (rowCount: number) => void;
}

// ============================================================================
// STORE TYPES
// ============================================================================

export interface TableV3Store {
  selectedItems: any[];
  selectingActive: boolean;
  lastSelecting: any;
  setLastSelecting: (data: any) => void;
  setSelectedItems: (data: any) => void;
  removeItem: (id: string) => void;
  cleanSelected: () => void;
  setAll: (data: any[]) => void;
  setActiveSelecting: (bool: boolean) => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface MemoizedValues {
  flattenedLength: number;
  hasFlattenedRows: boolean;
  columnsCount: number;
  cellCount: number;
}

export interface VirtualizedSortingResult {
  sortedRows: any[];
  flattenedRows: any[];
  totalRowCount: number;
  showSkeleton: boolean;
  activateSkeleton: () => void;
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

export type ContextMenuHandler = (event: MouseEvent, row: any) => void;
export type ThreeDotsClickHandler = (event: MouseEvent, row: any) => void;
export type CheckboxChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
export type SortChangeHandler = (newSort: Sort, newColumn?: string) => void;
export type ColumnChangeHandler = (newColumn: string) => void;
export type ActionHandler = (val?: any) => void;

// ============================================================================
// STYLE TYPES
// ============================================================================

export interface TableStyleProps {
  '--cell-count'?: number;
  '--cell-expand'?: number | string;
}

export interface SelectionBoxStyle extends CSSProperties {
  left: number;
  top: number;
  width: number;
  height: number;
}

// ============================================================================
// RENDER TYPES
// ============================================================================

export interface RenderRowFunction {
  (index: number, style: CSSProperties): ReactNode;
}

export interface GetStableKeyFunction {
  (row: any, index: number): string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface TableConfiguration {
  enableVirtualization: boolean;
  rowHeight: number;
  containerHeight: number | string;
  virtualizationThreshold: number;
  enableSortingPerformance: boolean;
  enableOptimisticSorting: boolean;
}

export interface SkeletonConfiguration {
  screenHeight: number;
  rowHeightPx: number;
  availableHeight: number;
  calculatedRows: number;
  skeletonRows: number;
}
