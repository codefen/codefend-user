import { PencilIcon } from '@icons';
import { forwardRef, type ForwardedRef, type ReactNode } from 'react';

interface ModalTextAreaProps {
  icon?: ReactNode;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  setValue?: (target: string) => void;
}

export const ModalTextArea = forwardRef(function ModalTextArea(
  {
    icon = <PencilIcon />,
    placeholder = '',
    setValue,
    defaultValue = '',
    required = false,
    maxLength,
    className = '',
  }: ModalTextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <div className="form-input">
      <span className="pencil-icon need-m">{icon}</span>
      <textarea
        ref={ref}
        className={`text-area-input log-inputs2 text-area ${className}`}
        onChange={e => setValue?.(e.target.value)}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}></textarea>
    </div>
  );
});
