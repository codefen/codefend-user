import { useState, useCallback, type MouseEvent } from 'react';
import type { ContextMenuState, ContextMenuAction } from './ContextMenu';

export const useContextMenu = (actions: ContextMenuAction[] = []) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    row: null,
  });

  const openContextMenu = useCallback(
    (event: MouseEvent, row: any) => {
      if (!actions.length) return;

      event.preventDefault();
      event.stopPropagation();

      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        row,
      });
    },
    [actions]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleThreeDotsClick = useCallback(
    (event: MouseEvent, row: any) => {
      if (!actions.length) return;

      event.preventDefault();
      event.stopPropagation();

      setContextMenu({
        visible: true,
        x: event.clientX,
        y: event.clientY,
        row,
      });
    },
    [actions]
  );

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
    handleThreeDotsClick,
  };
};
