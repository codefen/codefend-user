import type { ChangeEvent } from 'react';

interface InputFieldWithLabelProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
}

const InputFieldWithLabel = ({
  label = '',
  type = 'text',
  value,
  onChange,
  name,
  placeholder,
  required,
}: InputFieldWithLabelProps) => (
  <div className="confirm-input">
    {label ? <label htmlFor={name}>{label}</label> : null}
    <input
      id={name}
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default InputFieldWithLabel;
