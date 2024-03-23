import { type FC, type FormEvent } from 'react';
import { ButtonLoader, Show } from '../..';
import '../buttons.scss';
import './primaryButton.scss';

interface PrimaryButtonProps {
	click?: (e: FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: string | JSX.Element;
	className?: string;
	type?: string;
	disabledLoader?: boolean;
}

export const PrimaryButton: FC<PrimaryButtonProps> = (props) => {
	const primaryStyles = props.className ? props.className : '';
	const type = props.type === 'submit' ? props.type : 'button';
	const loader = props.disabledLoader ? false : true;

	const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
		if (!props.isDisabled) {
			props.click?.(e);
		}
	};
	return (
		<button
			type={type}
			onClick={handleClick}
			disabled={props.isDisabled}
			className={`btn btn-primary ${primaryStyles}`}>
			<Show when={props.isDisabled! && loader}>
				<ButtonLoader />
			</Show>
			{props.text}
		</button>
	);
};
