import React, { useEffect } from 'react';
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
		<article
			onDoubleClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				action && action();
			}}
			className="modal-wrapper">
			<div
				className={`modal ${!isErrorBox ? 'med-w' : ''}`}
				onDoubleClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}>
				{children}
			</div>
		</article>
	);
};

export default ModalWrapper;
