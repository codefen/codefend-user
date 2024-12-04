import { forwardRef, type ForwardedRef } from 'react';

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
  setVal?: (data: any) => void;
}

export const AuthInput = forwardRef(function AuthInput(
  {
    type = 'text',
    placeholder = '',
    defaultValue = '',
    required = false,
    autoComplete = 'off',
    setVal,
  }: AuthInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const onChange = (e: any) => {
    if (setVal) setVal(e.target.value);
  };
  return (
    <div className="input-group">
      <input
        onChange={onChange}
        ref={ref}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
});
