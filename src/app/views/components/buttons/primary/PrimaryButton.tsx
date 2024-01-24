import React from 'react';
import { ButtonLoader, Show } from '../..';
import '../buttons.scss';
import './primaryButton.scss';

interface PrimaryButtonProps {
	click?: (e: React.FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: string | JSX.Element;
	className?: string;
	type?: string;
	disabledLoader?: boolean;
}

export const PrimaryButton = (props: PrimaryButtonProps) => {
	const primaryStyles = props.className ? props.className : '';
	const type = props.type === 'submit' ? props.type : 'button';
	const loader = props.disabledLoader ? false : true;
	return (
		<button
			type={type}
			onClick={props.click}
			disabled={props.isDisabled}
			className={`log-inputs btn btn-primary ${primaryStyles}`}>
			<Show when={props.isDisabled! && loader}>
				<ButtonLoader />
			</Show>
			{props.text}
		</button>
	);
};
