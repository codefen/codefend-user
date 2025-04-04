import { GlobeWebIcon } from '@icons';
import { forwardRef, type ForwardedRef, type ReactNode } from 'react';

type HTMLInputTypeAttribute =
  | 'checkbox'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'search'
  | 'tel'
  | 'text'
  | 'time'
  | 'url';

interface ModalInputProps {
  icon?: ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  setValue?: (target: string) => void;
}

export const ModalInput = forwardRef(function ModalInput(
  {
    icon = <GlobeWebIcon />,
    type = 'text',
    placeholder = '',
    setValue,
    defaultValue = '',
    required = false,
  }: ModalInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="form-input">
      <span className="icon">{icon}</span>

      <input
        ref={ref}
        type={type}
        onChange={e => setValue?.(e.target.value)}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
});
