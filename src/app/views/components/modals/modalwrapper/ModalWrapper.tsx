import { useEffect, type FC, type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import './modal.scss';
import { CloseIcon, Show } from '../..';
import useKeyEventPress from '@stores/keyEvents';

interface ModalWrapper {
  children: ReactNode;
  isErrorBox?: boolean;
  action?: () => void;
  type?: string;
  showCloseBtn?: boolean;
  className?: string;
}
const root = document.getElementById('root-modal');

const ModalWrapper: FC<ModalWrapper> = ({
  isErrorBox = false,
  type,
  children,
  action,
  showCloseBtn,
  className = '',
}) => {
  const { setKeyPress, keyPress } = useKeyEventPress();
  const closeEvent = (e?: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    action && action();
  };

  useEffect(() => {
    if (keyPress === 'Escape') {
      closeEvent();
      setKeyPress('NONE');
    }
  }, [keyPress]);

  if (!root) {
    console.error('Modal root element not found');
    return null;
  }

  return ReactDOM.createPortal(
    <div
      onDoubleClick={closeEvent}
      className={`modal-wrapper ${className}`}
      role="dialog"
      aria-modal="true">
      <article
        className={`modal ${!isErrorBox ? type : ''}`}
        onDoubleClick={e => {
          e.nativeEvent.stopImmediatePropagation();
          e.stopPropagation();
        }}>
        <Show when={Boolean(showCloseBtn)}>
          <span className="modal-close-btn" onClick={closeEvent}>
            <CloseIcon isButton />
          </span>
        </Show>
        {children}
      </article>
    </div>,
    root
  );
};

export default ModalWrapper;
