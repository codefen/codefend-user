import { type FC } from 'react';
import '/public/flags/flags.css';

interface LocationItemProps {
  countryCode: string;
  country: string;
}

export const LocationItem: FC<LocationItemProps> = ({ countryCode, country }) => {
  return (
    <>
      <span className={`flag flag-${countryCode.toLowerCase()}`}></span>
      <pre>{' ' + country}</pre>
    </>
  );
};
