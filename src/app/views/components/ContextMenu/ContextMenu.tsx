import {
  memo,
  useEffect,
  useCallback,
  type FC,
  type ReactNode,
  type MouseEvent,
  useMemo,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import Show from '@/app/views/components/Show/Show';
import './context-menu.scss';

// ============================================================================
// TYPES
// ============================================================================

export interface ContextMenuAction {
  label: string;
  icon?: ReactNode;
  onClick: (row: any) => void;
  disabled?: boolean | ((row: any) => boolean);
  divider?: boolean;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  row: any;
}

export interface ContextMenuProps {
  contextMenu: ContextMenuState;
  actions: ContextMenuAction[];
  onClose: () => void;
  container?: HTMLElement;
}

// ============================================================================
// COMPONENT
// ============================================================================

const ContextMenu: FC<ContextMenuProps> = ({
  contextMenu,
  actions,
  onClose,
  container = document.getElementById('root-modal') as HTMLElement,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (contextMenu.visible) {
        onClose();
      }
    },
    [contextMenu.visible, onClose]
  );

  const handleScroll = useCallback(() => {
    if (contextMenu.visible) {
      onClose();
    }
  }, [contextMenu.visible, onClose]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside as any);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('click', handleClickOutside as any);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [handleClickOutside, handleScroll]);

  const handleActionClick = useCallback(
    (action: ContextMenuAction) => {
      const isDisabled =
        typeof action.disabled === 'function' ? action.disabled(contextMenu.row) : action.disabled;

      if (!isDisabled) {
        action.onClick(contextMenu.row);
        onClose();
      }
    },
    [contextMenu.row, onClose]
  );

  const isActionDisabled = useCallback(
    (action: ContextMenuAction) => {
      return typeof action.disabled === 'function'
        ? action.disabled(contextMenu.row)
        : action.disabled;
    },
    [contextMenu.row]
  );

  // Calculate optimal position for the context menu
  const menuPosition = useMemo(() => {
    if (!contextMenu.visible) return { top: -1000, left: -1000 };

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const menuWidth = 200; // Default menu width
    const menuHeight = actions.length * 40 + 16; // Approximate height

    let top = contextMenu.y;
    let left = contextMenu.x;

    // Adjust vertical position if menu would go off screen
    if (top + menuHeight > windowHeight - 20) {
      top = contextMenu.y - menuHeight;
      if (top < 20) top = 20;
    }

    // Adjust horizontal position if menu would go off screen
    if (left + menuWidth > windowWidth - 20) {
      left = windowWidth - menuWidth - 20;
    } else if (left < 20) {
      left = 20;
    }

    return { top, left };
  }, [contextMenu.visible, contextMenu.x, contextMenu.y, actions.length]);

  if (!container) {
    console.warn('ContextMenu: No container element found for portal');
    return null;
  }

  return (
    <Show when={contextMenu.visible}>
      {createPortal(
        <div
          ref={menuRef}
          className="card table-context-menu context-menu-visible"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}>
          {actions.map((action, index) => (
            <div key={index}>
              {action.divider && <div className="context-menu-divider" />}
              <button
                className={`context-menu-item ${isActionDisabled(action) ? 'disabled' : ''}`}
                onClick={() => handleActionClick(action)}
                disabled={isActionDisabled(action)}>
                {action.icon && <span className="context-menu-icon">{action.icon}</span>}
                <span className="context-menu-label">{action.label}</span>
              </button>
            </div>
          ))}
        </div>,
        container
      )}
    </Show>
  );
};

export default memo(ContextMenu);
