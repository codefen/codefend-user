import React from 'react';
import { PrimaryButton, SecondaryButton } from '..';

interface Props {
	close: () => void;
	isDisabled: boolean;
	confirmText: string;
	boxStyle?: string;
}

export const ModalButtons: React.FC<Props> = (props) => {
	return (
		<div
			className={`form-buttons ${props.boxStyle ?? ''}`}
			onClick={(e: React.FormEvent) => e.stopPropagation()}>
			<SecondaryButton
				text="Cancel"
				click={(e: any) => props.close?.()}
				isDisabled={props.isDisabled}
				className="btn-cancel codefend_secondary_ac"
			/>
			<PrimaryButton
				text={props.confirmText}
				click={() => {}}
				type="submit"
				isDisabled={props.isDisabled}
				className="btn-add codefend_main_ac ssm:min-h-[65px]"
			/>
		</div>
	);
};
