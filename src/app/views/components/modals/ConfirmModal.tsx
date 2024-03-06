import React, { useCallback, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '..';

interface ConfirmModalProps {
	close: () => void;
	action: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
	header: string;
	confirmText: string;
	cancelText: string;
}

// million-ignore
const ConfirmModal = (props: ConfirmModalProps) => {
	const [isConfirm, setConfirm] = useState<boolean>(false);

	const handleSubmit = useCallback(
		(e: React.MouseEvent | React.FormEvent<HTMLButtonElement>) => {
			e.preventDefault();
			setConfirm(true);
			props.action();
		},
		[props.action],
	);
	const handleClose = useCallback(
		(e: any) => {
			props.close();
		},
		[props.close],
	);

	return (
		<div className="content">
			<header>
				<h4 className="text-small title-format">{props.header}</h4>
			</header>
			<form>
				<div className="form-buttons">
					<SecondaryButton
						text={props.cancelText}
						click={handleClose}
						isDisabled={isConfirm}
						className="btn-cancel codefend_secondary_ac"
					/>
					<PrimaryButton
						text={props.confirmText}
						click={(e) => handleSubmit(e)}
						isDisabled={isConfirm}
						className="btn-add codefend_main_ac limit-height"
					/>
				</div>
			</form>
		</div>
	);
};

export default ConfirmModal;
