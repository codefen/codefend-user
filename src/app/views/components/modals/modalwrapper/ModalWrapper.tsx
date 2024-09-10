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
}

const ModalWrapper: FC<ModalWrapper> = ({
  isErrorBox = false,
  type,
  children,
  action,
  showCloseBtn,
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

  return ReactDOM.createPortal(
    <div onDoubleClick={closeEvent} className="modal-wrapper">
      <article
        className={`modal ${!isErrorBox ? type : ''}`}
        onDoubleClick={e => {
          e.preventDefault();
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
    document.getElementById('root-modal')!
  );
};

export default ModalWrapper;
