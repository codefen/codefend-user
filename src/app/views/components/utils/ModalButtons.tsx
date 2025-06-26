import { PrimaryButton } from '@buttons/index';
import { type FC, type FormEvent } from 'react';

interface Props {
  close: () => void;
  isDisabled: boolean;
  confirmText: string;
  closeText?: string;
  boxStyle?: string;
}

export const ModalButtons: FC<Props> = ({
  closeText = '',
  boxStyle = '',
  close,
  confirmText = '',
  isDisabled,
}) => {
  const text = Boolean(closeText.trim()) ? closeText : 'Cancel';
  return (
    <div className={`form-buttons ${boxStyle}`} onClick={(e: FormEvent) => e.stopPropagation()}>
      <PrimaryButton
        text={text}
        click={(e: any) => close?.()}
        isDisabled={isDisabled}
        className="btn-cancel codefend_secondary_ac"
        buttonStyle="black"
        disabledLoader
      />
      <PrimaryButton
        text={confirmText}
        click={() => {}}
        type="submit"
        isDisabled={isDisabled}
        className="btn-add codefend_main_ac limit-height"
        buttonStyle="red"
      />
    </div>
  );
};
