import { type FC, type FormEvent } from 'react';
import '../buttons.scss';
import './secondaryButton.scss';

interface SecondaryButtonProps {
	click: (e: FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: string;
	className?: string;
}

export const SecondaryButton: FC<SecondaryButtonProps> = (props) => {
	const secondaryStyles = props.className ? props.className : '';

	return (
		<button
			type="button"
			onClick={props.click}
			disabled={props.isDisabled}
			className={`btn btn-secondary ${secondaryStyles}`}>
			{props.text}
		</button>
	);
};
