import React from 'react';
import { ButtonLoader, Show } from '../..';
import '../buttons.scss';
import './dark.scss';

interface DarkButtonProps {
	click?: (e: React.FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: string | JSX.Element;
	className?: string;
	disabledLoader?: boolean;
}

export const DarkButton = (props: DarkButtonProps) => {
	const darkStyles = props.className ? props.className : '';
	const loader = props.disabledLoader ? false : true;
	return (
		<button
			type="button"
			onClick={props.click}
			disabled={props.isDisabled}
			className={`log-inputs btn btn-dark ${darkStyles}`}>
			<Show when={props.isDisabled! && loader}>
				<ButtonLoader />
			</Show>
			{props.text}
		</button>
	);
};
