import React from 'react';

interface LocationItemProps {
	countryCode: string;
	country: string;
}

export const LocationItem: React.FC<LocationItemProps> = ({
	countryCode,
	country,
}) => {
	return (
		<>
			<span className={`flag flag-${countryCode.toLowerCase()}`}></span>
			<pre>{' ' + country}</pre>
		</>
	);
};
