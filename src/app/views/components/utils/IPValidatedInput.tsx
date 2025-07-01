import { useState, useEffect, forwardRef, type ChangeEvent } from 'react';
import { GlobeWebIcon } from '@icons';

// Iconos de validación
const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#22c55e"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"></polyline>
  </svg>
);

const CrossIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ef4444"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Función para validar IPv4
const isValidIPv4 = (ip: string): boolean => {
  if (!ip) return false;
  const ipv4Regex =
    /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

// Función para validar IPv6 - Implementación robusta basada en estándares
const isValidIPv6 = (ip: string): boolean => {
  if (!ip) return false;

  // Usar regex completa que maneja todos los casos de IPv6 válidos
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}|:(:[0-9a-fA-F]{1,4}){1,7}|::|::1)$/i;

  return ipv6Regex.test(ip);
};

// Función para verificar si una IPv6 es privada/local
const isPrivateIPv6 = (ip: string): boolean => {
  if (!isValidIPv6(ip)) return false;

  // Normalizar la dirección para facilitar la comparación
  const normalizedIP = ip.toLowerCase();

  // Link-local addresses (fe80::/10)
  if (
    normalizedIP.startsWith('fe8') ||
    normalizedIP.startsWith('fe9') ||
    normalizedIP.startsWith('fea') ||
    normalizedIP.startsWith('feb')
  ) {
    return true;
  }

  // Unique local addresses (fc00::/7 - fd00::/8)
  if (normalizedIP.startsWith('fc') || normalizedIP.startsWith('fd')) {
    return true;
  }

  // Loopback (::1)
  if (normalizedIP === '::1') {
    return true;
  }

  // Unspecified address (::)
  if (normalizedIP === '::') {
    return true;
  }

  return false;
};

// Función para verificar si es IP privada (interna)
const isPrivateIP = (ip: string): boolean => {
  // Primero verificar si es IPv4
  if (isValidIPv4(ip)) {
    const parts = ip.split('.').map(Number);

    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) return true;

    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 127.0.0.0 - 127.255.255.255 (loopback)
    if (parts[0] === 127) return true;

    // 169.254.0.0 - 169.254.255.255 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;

    return false;
  }

  // Si es IPv6, usar la función específica
  if (isValidIPv6(ip)) {
    return isPrivateIPv6(ip);
  }

  return false;
};

// Función principal de validación
const validateIP = (ip: string, isExternal: boolean): { isValid: boolean; message: string } => {
  if (!ip) return { isValid: false, message: '' };

  const isIPv4Valid = isValidIPv4(ip);
  const isIPv6Valid = isValidIPv6(ip);

  if (!isIPv4Valid && !isIPv6Valid) {
    return {
      isValid: false,
      message: isExternal ? 'invalid external IP' : 'invalid internal IP',
    };
  }

  const isPrivate = isPrivateIP(ip);

  if (isExternal && isPrivate) {
    return { isValid: false, message: 'invalid external IP' };
  }

  if (!isExternal && !isPrivate) {
    return { isValid: false, message: 'invalid internal IP' };
  }

  return {
    isValid: true,
    message: isExternal ? 'valid external IP' : 'valid internal IP',
  };
};

interface IPValidatedInputProps {
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
  isExternal?: boolean; // true para IP externa, false para IP interna
}

export const IPValidatedInput = forwardRef<HTMLInputElement, IPValidatedInputProps>(
  (
    {
      placeholder = 'IP Address',
      required = false,
      defaultValue = '',
      onChange,
      isExternal = true,
    },
    ref
  ) => {
    const [ipValue, setIpValue] = useState(defaultValue);
    const [validation, setValidation] = useState<{ isValid: boolean | null; message: string }>({
      isValid: null,
      message: '',
    });

    // Filtrar solo caracteres válidos para IP (números, puntos, dos puntos para IPv6, letras para IPv6)
    const filterIPCharacters = (value: string): string => {
      // Permitir números, puntos, dos puntos y letras A-F para IPv6
      return value.replace(/[^0-9.:a-fA-F]/g, '');
    };

    // Validar IP cuando cambie
    useEffect(() => {
      if (ipValue) {
        const result = validateIP(ipValue, isExternal);
        setValidation({ isValid: result.isValid, message: result.message });
      } else {
        setValidation({ isValid: null, message: '' });
      }
    }, [ipValue, isExternal]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const filteredValue = filterIPCharacters(rawValue);

      // Solo actualizar si el valor filtrado es diferente
      if (filteredValue !== rawValue) {
        e.target.value = filteredValue;
      }

      setIpValue(filteredValue);
      onChange?.(filteredValue);
    };

    const handleKeyDown = (e: any) => {
      // Permitir teclas de navegación y control
      const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'F5',
      ];

      if (allowedKeys.includes(e.key)) return;

      // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
      if (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) return;

      // Solo permitir números, puntos, dos puntos y letras A-F
      const isValidChar = /[0-9.:a-fA-F]/.test(e.key);

      if (!isValidChar) {
        e.preventDefault();
      }
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
          onKeyDown={handleKeyDown}
          style={{ paddingRight: validation.isValid !== null ? '45px' : '15px' }}
        />
        {validation.isValid !== null && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              zIndex: 2,
            }}>
            {validation.isValid ? (
              <>
                <CheckIcon />
                <span style={{ color: '#22c55e', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {validation.message}
                </span>
              </>
            ) : (
              <>
                <CrossIcon />
                <span style={{ color: '#ef4444', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {validation.message}
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
