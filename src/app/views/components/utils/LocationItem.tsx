import { type FC } from 'react';

interface LocationItemProps {
  countryCode: string;
  country: string;
  showCountryCode?: boolean;
  showCountryName?: boolean; // Nueva prop opcional para controlar si mostrar el nombre
}

export const LocationItem: FC<LocationItemProps> = ({ 
  countryCode, 
  country, 
  showCountryCode = false,
  showCountryName = true // Por defecto muestra el nombre para mantener compatibilidad
}) => {
  const code = (countryCode || '').trim();
  const hasCountryCode = code !== '';
  const display = showCountryCode && /^[a-z]{2}$/i.test(code) ? code.toUpperCase() : (country || (showCountryCode ? '—' : ''));
  const countryView = hasCountryCode ? ` ${display}` : display;
  
  return (
    <>
      {hasCountryCode ? (
        <span className={`flag flag-${code.toLowerCase()}`}></span>
      ) : null}
      {showCountryName && <pre title={showCountryCode ? country || undefined : undefined}>{countryView}</pre>}
    </>
  );
};
