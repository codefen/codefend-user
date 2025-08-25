import { forwardRef, type ChangeEvent, type ReactNode } from 'react';

interface SelectFieldProps {
  options: any[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  icon?: ReactNode | string | null;
  className?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  {
    options,
    defaultValue = '',
    onChange,
    value,
    disabled,
    required,
    name = 'select',
    icon = null,
    className = '',
  },
  ref
) {
  return (
    <div className={`input-group ${className}`}>
      {icon ? <span className="icon">{icon}</span> : null}

      <select
        ref={ref}
        name={name}
        {...(value !== undefined ? { value } : { defaultValue })}
        onChange={onChange}
        disabled={disabled}
        className="log-inputs log-text"
        required={required}>
        {options.map((option, index) => (
          <option key={`${name}-${index}`} value={option.value} hidden={option?.hidden}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default SelectField;
