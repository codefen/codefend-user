import { type FC } from 'react';

interface LocationItemProps {
  countryCode: string;
  country: string;
}

export const LocationItem: FC<LocationItemProps> = ({ countryCode, country }) => {
  const hasCountryCode = countryCode !== '';
  const countryView = hasCountryCode ? ` ${country}` : country;
  return (
    <>
      {hasCountryCode ? (
        <span className={`flag flag-${countryCode?.toLowerCase?.()}`}></span>
      ) : null}
      <pre>{countryView}</pre>
    </>
  );
};
