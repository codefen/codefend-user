import { type FC, type FormEvent } from 'react';
import '../buttons.scss';
import './tertiaryButton.scss';

interface TertiaryButtonProps {
	click: (e: FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: string;
	className?: string;
}

export const TertiaryButton: FC<TertiaryButtonProps> = (props) => {
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
