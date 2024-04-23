import React, { useEffect, type ReactNode } from 'react';
import './modal.scss';
import { CloseIcon, Show } from '../..';

interface ModalWrapper {
	children: ReactNode;
	isErrorBox?: boolean;
	action?: () => void;
	type?: string;
	showCloseBtn?: boolean;
}

const ModalWrapper: React.FC<ModalWrapper> = ({
	isErrorBox = false,
	type,
	children,
	action,
	showCloseBtn,
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
				<Show when={Boolean(showCloseBtn)}>
					<span className="modal-close-btn" onClick={closeEvent}>
						<CloseIcon isButton />
					</span>
				</Show>
				{children}
			</article>
		</div>
	);
};

export default ModalWrapper;
