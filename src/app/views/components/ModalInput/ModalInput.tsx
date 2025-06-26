import { GlobeWebIcon } from '@icons';
import { forwardRef, type ForwardedRef, type ReactNode } from 'react';

// Íconos para mostrar/ocultar contraseña
const EyeIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

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
  name?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export const ModalInput = forwardRef(function ModalInput(
  {
    icon = <GlobeWebIcon />,
    type = 'text',
    placeholder = '',
    setValue,
    defaultValue = '',
    required = false,
    name,
    showPasswordToggle = false,
    isPasswordVisible = false,
    onTogglePassword,
  }: ModalInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="form-input" style={{ position: 'relative' }}>
      {icon && <span className="icon">{icon}</span>}

      <input
        ref={ref}
        type={type}
        onChange={e => setValue?.(e.target.value)}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        name={name}
        style={showPasswordToggle ? { paddingRight: '45px' } : {}}
      />
      
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: '5px',
            cursor: 'pointer',
            color: 'var(--tertiary-color-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease',
            zIndex: 2,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--tertiary-color-600)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--tertiary-color-400)')}
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}>
          {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  );
});
