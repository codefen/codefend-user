import React from 'react';
import { ButtonLoader, Show } from '../..';
import '../buttons.scss';
import '../primary/primaryButton.scss';

interface SendButtonProps {
	click?: (e: React.FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	viewLoader: boolean;
	text: string | JSX.Element;
	className?: string;
}

export const SendButton = (props: SendButtonProps) => {
	const primaryStyles = props.className ? props.className : '';
	return (
		<button
			type="button"
			onClick={props.click}
			disabled={props.isDisabled}
			className={`log-inputs btn btn-primary no-border-height send-btn ${primaryStyles}`}>
			<Show when={!props.viewLoader} fallback={<ButtonLoader left="35%" />}>
				<>{props.text}</>
			</Show>
		</button>
	);
};
