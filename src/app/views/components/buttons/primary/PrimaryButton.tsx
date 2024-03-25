import type { FC, FormEvent, ReactNode } from 'react';
import { ButtonLoader, Show } from '../..';
import '../buttons.scss';
import './primaryButton.scss';

enum ButtonStyles {
	RED = 'red',
	BLACK = 'black',
	GRAY = 'gray',
	SEND = 'send',
	DEFAULT = 'default',
}

interface PrimaryButtonProps {
	click?: (e: FormEvent<HTMLButtonElement>) => void;
	isDisabled?: boolean;
	text: ReactNode;
	className?: string;
	type?: 'submit' | 'reset' | 'button';
	disabledLoader?: boolean;
	buttonStyle?: 'red' | 'black' | 'gray' | 'default' | 'send' | ButtonStyles;
	hideContent?: boolean;
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({
	click,
	text,
	className = '',
	isDisabled,
	disabledLoader,
	type = 'button',
	buttonStyle = 'red',
	hideContent = false,
}) => {
	const buttonStyles = {
		[ButtonStyles.RED]: 'btn-red',
		[ButtonStyles.BLACK]: 'btn-black',
		[ButtonStyles.GRAY]: 'btn-gray',
		[ButtonStyles.SEND]: 'btn-red send-btn',
		[ButtonStyles.DEFAULT]: '',
	};

	const loader = disabledLoader ? false : true;
	const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
		if (!isDisabled) click?.(e);
	};

	return (
		<button
			type={type}
			onClick={handleClick}
			disabled={isDisabled}
			className={`btn ${buttonStyles[buttonStyle]} ${className}`}>
			<Show when={Boolean(isDisabled) && loader}>
				<ButtonLoader />
			</Show>
			<Show when={!hideContent} fallback={<ButtonLoader left="33%" />}>
				{text}
			</Show>
		</button>
	);
};
