import { memo, useMemo, type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table';

const SKELETON_CONFIG = {
  screenHeightRatio: 0.85,
  rowHeight: 49,
  minRows: 4,
  cellHeight: 12,
  cellBorderRadius: 6,
  checkboxWidth: 50,
  checkboxMargin: 16,
  columnMargin: 16,
} as const;

interface TableSkeletonProps {
  totalRowCount: number;
  rowsLength: number;
  isNeedMultipleCheck: boolean;
  columns: ColumnTableV3[];
}

const TableSkeleton: FC<TableSkeletonProps> = ({
  totalRowCount,
  rowsLength,
  isNeedMultipleCheck,
  columns,
}) => {
  const skeletonRowCount = useMemo(() => {
    // console.log('🧙‍♂️ TableSkeleton - totalRowCount:', totalRowCount, 'rowsLength:', rowsLength);
    const screenHeight = window.innerHeight;
    const availableHeight = screenHeight * SKELETON_CONFIG.screenHeightRatio;
    const calculatedRows = Math.floor(availableHeight / SKELETON_CONFIG.rowHeight);

    const finalCount = Math.max(
      Math.min(calculatedRows, totalRowCount || rowsLength || 10),
      SKELETON_CONFIG.minRows
    );

    // console.log('🧙‍♂️ TableSkeleton - finalCount:', finalCount, 'columns:', columns.length);
    return finalCount;
  }, [totalRowCount, rowsLength, columns.length]);

  // console.log('🧙‍♂️ TableSkeleton - Rendering skeleton with', skeletonRowCount, 'rows');

  return (
    <div className="sorting-skeleton">
      {Array.from({ length: skeletonRowCount }).map((_, index) => (
        <div
          key={index}
          className="skeleton-row item"
          style={{ height: `${SKELETON_CONFIG.rowHeight}px` }}>
          {isNeedMultipleCheck && (
            <div
              className="skeleton-cell item-cell"
              style={{
                width: `${SKELETON_CONFIG.checkboxWidth}px`,
                marginRight: `${SKELETON_CONFIG.checkboxMargin}px`,
                flex: '0 0 50px',
              }}
            />
          )}
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`skeleton-cell item-cell skeleton-cell-${(colIndex % 5) + 1}`}
              style={{
                flex: col.weight || 1,
                marginRight:
                  colIndex === columns.length - 1 ? '0' : `${SKELETON_CONFIG.columnMargin}px`,
                height: `${SKELETON_CONFIG.cellHeight}px`,
                borderRadius: `${SKELETON_CONFIG.cellBorderRadius}px`,
                minWidth: 0,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default memo(TableSkeleton);
