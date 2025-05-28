import { type FC, type FormEvent, type MouseEvent, useCallback, useState } from 'react';
import { PrimaryButton } from '..';

interface ConfirmModalProps {
  close: () => void;
  action: (e?: MouseEvent<HTMLDivElement, MouseEvent>) => void;
  header: string;
  confirmText: string;
  cancelText: string;
}

const ConfirmModal: FC<ConfirmModalProps> = props => {
  const [isConfirm, setConfirm] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (e: MouseEvent | FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setConfirm(true);
      props.action();
    },
    [props.action, setConfirm]
  );
  const handleClose = useCallback(
    (e: any) => {
      e.preventDefault();
      props.close();
    },
    [props.close, setConfirm]
  );

  return (
    <div className="content">
      <header>
        <h4 className="text-small title-format">{props.header}</h4>
      </header>
      <form>
        <div className="form-buttons">
          <PrimaryButton
            text={props.cancelText}
            click={handleClose}
            isDisabled={isConfirm}
            className="btn-cancel codefend_secondary_ac"
            buttonStyle="black"
            disabledLoader
          />
          <PrimaryButton
            text={props.confirmText}
            click={e => handleSubmit(e)}
            isDisabled={isConfirm}
            className="btn-add codefend_main_ac limit-height"
            buttonStyle="red"
          />
        </div>
      </form>
    </div>
  );
};

export default ConfirmModal;
