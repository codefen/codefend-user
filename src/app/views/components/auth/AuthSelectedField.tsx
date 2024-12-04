import { forwardRef, type ChangeEvent } from 'react';

interface SelectFieldProps {
  options: any[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
}

const AuthSelectedField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { options, defaultValue = '', onChange, value, disabled, required },
  ref
) {
  return (
    <div className="input-group">
      <select
        ref={ref}
        defaultValue={defaultValue}
        onChange={onChange}
        value={value}
        disabled={disabled}
        className="log-inputs log-text"
        required={required}>
        {options.map((option, index) => (
          <option key={index} value={option.value} hidden={option?.hidden}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default AuthSelectedField;
