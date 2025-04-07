import { forwardRef, type ChangeEvent } from 'react';

interface SelectFieldProps {
  options: any[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { options, defaultValue = '', onChange, value, disabled, required, name = 'select' },
  ref
) {
  return (
    <div className="input-group">
      <select
        ref={ref}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
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
