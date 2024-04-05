import React, { useEffect } from 'react';
import './modal.scss';
import { CloseIcon } from '../..';

interface ModalWrapper {
	children: JSX.Element;
	isErrorBox?: boolean;
	action?: () => void;
	type?: string;
}

const ModalWrapper: React.FC<ModalWrapper> = ({
	isErrorBox = false,
	type,
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

	const closeEvent = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		action && action();
	};
	return (
		<div onDoubleClick={closeEvent} className="modal-wrapper">
			<article
				className={`modal ${!isErrorBox ? type : ''}`}
				onDoubleClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				<span className="modal-close-btn" onClick={closeEvent}>
					<CloseIcon isButton />
				</span>
				{children}
			</article>
		</div>
	);
};

export default ModalWrapper;
