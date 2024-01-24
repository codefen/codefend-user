import React, { ReactNode, useCallback } from 'react';
import { ModalWrapper, Show, StatIcon } from '..';

interface ModalTitleWrapperProps {
	children: JSX.Element;
	headerTitle: string;
	isActive: boolean;
	close: () => void;
}

// million-ignore
const ModalTitleWrapper = ({
	children,
	headerTitle,
	isActive,
	close,
}: ModalTitleWrapperProps) => {
	return (
		<>
			<Show when={isActive}>
				<ModalWrapper action={close}>
					<div
						className="modal-wrapper-title internal-tables disable-border"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}>
						<div className="modal-header">
							<div className="icon">
								<StatIcon />
							</div>
							{headerTitle}
						</div>
						{children}
						<div className="modal-helper-box text-format"></div>
					</div>
				</ModalWrapper>
			</Show>
		</>
	);
};

export default ModalTitleWrapper;
