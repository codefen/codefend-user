import { type FC } from 'react';

interface LocationItemProps {
  countryCode: string;
  country: string;
  showCountryName?: boolean; // Nueva prop opcional para controlar si mostrar el nombre
}

export const LocationItem: FC<LocationItemProps> = ({ 
  countryCode, 
  country, 
  showCountryName = true // Por defecto muestra el nombre para mantener compatibilidad
}) => {
  const hasCountryCode = countryCode !== '';
  const countryView = hasCountryCode ? ` ${country}` : country;
  
  return (
    <>
      {hasCountryCode ? (
        <span className={`flag flag-${countryCode?.toLowerCase?.()}`}></span>
      ) : null}
      {showCountryName && <pre>{countryView}</pre>}
    </>
  );
};
