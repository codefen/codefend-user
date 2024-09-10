import { TABLE_KEYS } from '@/app/constants/app-texts';
import useTableStoreV3 from '@table/v3/tablev3.store';
import { useRef, useState } from 'react';

export const useMultipleSelect = (isNeedMultipleCheck: boolean) => {
  const [selectionBox, setSelectionBox] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const { setSelectedItems, selectedItems, removeItem, setActiveSelecting } = useTableStoreV3();
  const prevRef = useRef<any>([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isNeedMultipleCheck && !isSelecting) return;
    setIsSelecting(true);
    prevRef.current = selectedItems;
    setSelectionBox({
      startX: e.clientX,
      startY: e.clientY,
      endX: e.clientX,
      endY: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isSelecting) {
      setActiveSelecting(true);
      setSelectionBox(prevBox => ({
        ...prevBox,
        endX: e.clientX,
        endY: e.clientY,
      }));

      if (tableRef.current) {
        const items = tableRef.current.querySelectorAll(TABLE_KEYS.ITEM_CLASS);

        for (const item of items) {
          const rect = item.getBoundingClientRect();
          const id = item.getAttribute(TABLE_KEYS.ITEM_ROW_ID);

          const selectionBoxLeft = Math.min(selectionBox.startX, selectionBox.endX);
          const selectionBoxRight = Math.max(selectionBox.startX, selectionBox.endX);
          const selectionBoxTop = Math.min(selectionBox.startY, selectionBox.endY);
          const selectionBoxBottom = Math.max(selectionBox.startY, selectionBox.endY);

          const isInSelectionBox =
            rect.right >= selectionBoxLeft &&
            rect.left <= selectionBoxRight &&
            rect.bottom >= selectionBoxTop &&
            rect.top <= selectionBoxBottom;

          if (isInSelectionBox && !selectedItems.includes(id)) {
            setSelectedItems(id);
          } else if (
            !isInSelectionBox &&
            !prevRef.current.includes(id) &&
            selectedItems.includes(id)
          ) {
            removeItem(id || '');
          }
        }
      }
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
    }
  };

  return {
    tableRef,
    isSelecting,
    selectionBox,
    handleMouseUp,
    handleMouseMove,
    handleMouseDown,
  } as const;
};
