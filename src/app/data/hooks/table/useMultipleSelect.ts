import { TABLE_KEYS } from '@/app/constants/app-texts';
import { useTableStoreV3 } from '@table/v3/tablev3.store';
import { useCallback, useMemo, useRef, useState, type PointerEvent } from 'react';
import { withBatchedUpdates } from '@utils/helper';

type SelectingBox = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type SelectingBoxSides = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const getSelectionBoxRect = (selectionBox: SelectingBox): SelectingBoxSides => {
  return {
    left: Math.min(selectionBox.startX, selectionBox.endX),
    right: Math.max(selectionBox.startX, selectionBox.endX),
    top: Math.min(selectionBox.startY, selectionBox.endY),
    bottom: Math.max(selectionBox.startY, selectionBox.endY),
  };
};

const isRectIntersecting = (rect1: DOMRect, rect2: SelectingBoxSides) => {
  return (
    rect1.right >= rect2.left &&
    rect1.left <= rect2.right &&
    rect1.bottom >= rect2.top &&
    rect1.top <= rect2.bottom
  );
};

export const useMultipleSelect = (isNeedMultipleCheck: boolean) => {
  const [selectionBox, setSelectionBox] = useState<SelectingBox>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const { setSelectedItems, selectedItems, removeItem } = useTableStoreV3();
  const prevSelectedItems = useRef<any>([]);
  const tableItems = useRef<{ rect: DOMRect; id: string }[]>([]);

  const onPointerDown = useCallback(
    withBatchedUpdates((e: PointerEvent<HTMLDivElement>) => {
      // isPrimary es true solo para el primer click detectado
      if (!isNeedMultipleCheck || !e.isPrimary) return;

      setIsSelecting(true);
      // Se guarda los elementos previamente seleccionados
      prevSelectedItems.current = selectedItems;
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY,
      });
      if (tableRef.current) {
        const items = tableRef.current.querySelectorAll(TABLE_KEYS.ITEM_CLASS);
        // Cuando se activa el pointer down se cachea ID y el react
        tableItems.current = Array.from(items).map(item => ({
          rect: item.getBoundingClientRect(),
          id: item.getAttribute(TABLE_KEYS.ITEM_ROW_ID) || '',
        }));
      }
    }),
    [isNeedMultipleCheck, selectedItems]
  );

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (isSelecting) {
      setIsMoving(true);
      setSelectionBox(prevBox => ({
        ...prevBox,
        endX: e.clientX,
        endY: e.clientY,
      }));

      const selectionBoxRect = getSelectionBoxRect(selectionBox);
      for (const { id, rect } of tableItems.current) {
        const isInSelectionBox = isRectIntersecting(rect, selectionBoxRect);

        if (isInSelectionBox && !selectedItems.includes(id)) {
          // Si esta, dentro del select-box y no estaba seleccionado. Lo selecciona
          setSelectedItems(id);
        } else if (
          !isInSelectionBox &&
          !prevSelectedItems.current.includes(id) &&
          selectedItems.includes(id)
        ) {
          // Si esta, fuera del select-box Y no estaba previamente seleccionado. Lo remueve
          removeItem(id || '');
        }
      }
    }
  };

  const onPointerStop = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.isPrimary) {
      setIsSelecting(false);
      setIsMoving(false);
    }
    tableItems.current = [];
  }, []);

  const selectionBoxStyle = useMemo(
    () => ({
      left: Math.min(selectionBox.startX, selectionBox.endX),
      top: Math.min(selectionBox.startY, selectionBox.endY),
      width: Math.abs(selectionBox.endX - selectionBox.startX),
      height: Math.abs(selectionBox.endY - selectionBox.startY),
    }),
    [selectionBox]
  );

  return {
    tableRef,
    isSelecting,
    isMoving,
    selectionBoxStyle,
    onPointerStop,
    onPointerMove,
    onPointerDown,
  } as const;
};
