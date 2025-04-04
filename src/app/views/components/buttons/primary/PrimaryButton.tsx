import type { FC, FormEvent, ReactNode } from 'react';
import '../buttons.scss';
import './primaryButton.scss';
import Show from '@/app/views/components/Show/Show';
import { ButtonLoader } from '@/app/views/components/loaders/Loader';

enum ButtonStyles {
  RED = 'red',
  BLACK = 'black',
  DARK_RED = 'dark-red',
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
  buttonStyle?: 'red' | 'black' | 'gray' | 'default' | 'send' | 'dark-red' | ButtonStyles;
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
    [ButtonStyles.DARK_RED]: 'btn-dark-red',
    [ButtonStyles.DEFAULT]: '',
  };

  const handleClick = (e: FormEvent<HTMLButtonElement>) => {
    if (!isDisabled) click?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`btn ${buttonStyles[buttonStyle]} ${className}`}>
      <Show when={Boolean(isDisabled) && !disabledLoader}>
        <ButtonLoader />
      </Show>
      <Show when={!hideContent} fallback={<ButtonLoader left="33%" />}>
        {text}
      </Show>
    </button>
  );
};
