import { type FC, type ReactNode } from 'react';
import { ModalWrapper, StatIcon } from '../..';

interface ModalTitleWrapperProps {
  children: ReactNode;
  headerTitle: string;
  type?: string;
  isActive: boolean;
  close: () => void;
}

const ModalTitleWrapper: FC<ModalTitleWrapperProps> = ({
  children,
  headerTitle,
  type,
  isActive,
  close,
}) => {
  if (!isActive) {
    return null;
  }
  return (
    <ModalWrapper action={close} showCloseBtn type={`${type} title-wrapper`}>
      <div className="header">
        <div className="icon">
          <StatIcon />
        </div>
        {headerTitle}
      </div>
      {children}
      <div className="modal-helper-box text-format"></div>
    </ModalWrapper>
  );
};

export default ModalTitleWrapper;
