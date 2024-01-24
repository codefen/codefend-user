import React from 'react';
import '../buttons.scss';
import './secondaryButton.scss';

interface TertiaryButtonProps {
	click: (e: React.FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: string;
	className?: string;
}

export const TertiaryButton = (props: TertiaryButtonProps) => {
	const tertiaryStyles = props.className ? props.className : '';

	return (
		<button
			type="button"
			onClick={props.click}
			disabled={props.isDisabled}
			className={`log-inputs btn btn-tertiary ${tertiaryStyles}`}>
			{props.text}
		</button>
	);
};
