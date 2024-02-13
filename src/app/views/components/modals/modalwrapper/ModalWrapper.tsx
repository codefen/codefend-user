import React, { useCallback, useEffect } from 'react';
import './modal.scss';

interface ModalWrapper {
	children: JSX.Element;
	isErrorBox?: boolean;
	action?: () => void;
}

const ModalWrapper: React.FC<ModalWrapper> = ({
	isErrorBox = false,
	children,
	action,
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				action && action();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);
	return (
		<div
			onDoubleClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				action && action();
			}}
			className="modal-wrapper">
			<div
				className={`wrapper-content ${!isErrorBox ? 'max-w' : ''}`}
				onDoubleClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				<div>{children}</div>
			</div>
		</div>
	);
};

export default ModalWrapper;
