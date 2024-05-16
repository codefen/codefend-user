import { PencilIcon } from '@icons';
import type { FC } from 'react';

interface ModalInputProps {
	icon?: React.ReactNode;
	placeholder?: string;
	defaultValue?: string;
	required?: boolean;
	maxLength?: number;
	setValue: (target: string) => void;
}

export const ModalTextArea: FC<ModalInputProps> = ({
	icon = <PencilIcon />,
	placeholder = '',
	setValue,
	defaultValue = '',
	required = false,
	maxLength,
}) => (
	<div className="form-input">
		<span className="pencil-icon need-m">{icon}</span>
		<textarea
			className="text-area-input log-inputs2 text-area"
			onChange={(e) => setValue(e.target.value)}
			defaultValue={defaultValue}
			placeholder={placeholder}
			required={required}
			maxLength={maxLength}></textarea>
	</div>
);
