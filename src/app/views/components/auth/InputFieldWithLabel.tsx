import type { ChangeEvent } from 'react';

interface InputFieldWithLabelProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
}

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  name,
  placeholder,
  required,
}) => (
  <div className="confirm-input">
    <label htmlFor={name}>{label}</label>
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
