import React from 'react';
import './loaders.scss';

/**
 * Spinner for loaders made only with CSS
 * @param {string} icon - "loaders.scss" css class that defines the size of the Spinner
 */
const Spinner: React.FC<{ icon: string }> = ({ icon }) => (
	<aside className={`spinner ${icon}`}></aside>
);

export const ButtonLoader: React.FC<{ left?: any; right?: any }> = ({
	left = '7%',
	right = 'inherit',
}) => {
	return (
		<div
			className="button-loader"
			style={
				{
					'--pos-left': left!,
					'--pos-right': right!,
				} as any
			}></div>
	);
};

export const Loader = () => {
	return (
		<div className="loader loader-screen">
			<Spinner icon="icon" />
		</div>
	);
};

export const PageLoader = () => {
	return (
		<div className="loader loader-full">
			<Spinner icon="small-icon" />
		</div>
	);
};

export const PageLoaderWhite = () => {
	return (
		<div className="loader loader-full">
			<Spinner icon="icon" />
		</div>
	);
};

export const PageLoaderOverlay = () => {
	return (
		<div className="loader loader-full overlay">
			<Spinner icon="small-icon" />
		</div>
	);
};
