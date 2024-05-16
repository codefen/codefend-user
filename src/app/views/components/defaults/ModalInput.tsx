import { GlobeWebIcon } from '@icons';
import type { FC } from 'react';

type HTMLInputTypeAttribute =
	| 'checkbox'
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'month'
	| 'number'
	| 'password'
	| 'radio'
	| 'search'
	| 'tel'
	| 'text'
	| 'time'
	| 'url';

interface ModalInputProps {
	icon?: React.ReactNode;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	defaultValue?: string;
	required?: boolean;
	setValue: (target: string) => void;
}

export const ModalInput: FC<ModalInputProps> = ({
	icon = <GlobeWebIcon />,
	type = 'text',
	placeholder = '',
	setValue,
	defaultValue = '',
	required = false,
}) => (
	<div className="form-input">
		<span className="icon">{icon}</span>

		<input
			type={type}
			onChange={(e) => {
				setValue(e.target.value);
			}}
			defaultValue={defaultValue}
			placeholder={placeholder}
			required={required}
		/>
	</div>
);
