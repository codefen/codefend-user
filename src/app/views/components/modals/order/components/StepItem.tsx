import React from 'react';

interface StepItemProps {
	text: string;
	styles: string;
}

export const StepItem: React.FC<StepItemProps> = ({ text, styles = '' }) => {
	return (
		<span className={`step ${styles}`}>
			<div className="step-dot"></div>
			<p>{text}</p>
		</span>
	);
};
