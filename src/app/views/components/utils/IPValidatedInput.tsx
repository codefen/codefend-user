import { useState, useEffect, forwardRef, type ForwardedRef } from 'react';
import { GlobeWebIcon } from '@icons';

// Iconos de validación
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const CrossIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Función para validar IPv4
const isValidIPv4 = (ip: string): boolean => {
  if (!ip) return false;
  const ipv4Regex = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

interface IPValidatedInputProps {
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const IPValidatedInput = forwardRef<HTMLInputElement, IPValidatedInputProps>(
  ({ placeholder = "IP Address", required = false, defaultValue = "", onChange }, ref) => {
    const [ipValue, setIpValue] = useState(defaultValue);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    // Validar IP cuando cambie
    useEffect(() => {
      if (ipValue) {
        setIsValid(isValidIPv4(ipValue));
      } else {
        setIsValid(null);
      }
    }, [ipValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setIpValue(value);
      onChange?.(value);
    };

    return (
      <div className="form-input" style={{ position: 'relative' }}>
        <span className="icon">
          <GlobeWebIcon />
        </span>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          required={required}
          value={ipValue}
          onChange={handleChange}
          style={{ paddingRight: isValid !== null ? '45px' : '15px' }}
        />
        {isValid !== null && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            zIndex: 2,
          }}>
            {isValid ? <CheckIcon /> : (
              <>
                <CrossIcon />
                <span style={{ color: '#ef4444', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  invalid IP
                </span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

IPValidatedInput.displayName = 'IPValidatedInput'; 