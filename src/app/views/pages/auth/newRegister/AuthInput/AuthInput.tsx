import { forwardRef, type ChangeEvent, type ForwardedRef } from 'react';

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
  | 'url'
  | 'tel';

interface AuthInputProps {
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  setVal?: (data: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
}

export const AuthInput = forwardRef(function AuthInput(
  {
    type = 'text',
    placeholder = '',
    defaultValue = '',
    required = false,
    autoComplete = 'off',
    name,
    setVal,
    disabled = false,
  }: AuthInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="input-group">
      <input
        ref={ref}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        onChange={setVal}
        name={name}
        disabled={disabled}
      />
    </div>
  );
});
