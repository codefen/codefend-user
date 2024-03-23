import { type FC } from 'react';

interface StepItemProps {
	text: string;
	styles: string;
}

export const StepItem: FC<StepItemProps> = ({ text, styles = '' }) => {
	return (
		<span className={`step ${styles}`}>
			<div className="step-dot"></div>
			<p>{text}</p>
		</span>
	);
};
