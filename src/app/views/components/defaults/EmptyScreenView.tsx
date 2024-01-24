import React from 'react';
import { PrimaryButton } from '..';

interface EmptyScreenProps {
	title?: string;
	info?: string;
	buttonText?: string;
	event?: () => void;
}

const EmptyScreenView = ({
	title,
	info,
	buttonText,
	event,
}: EmptyScreenProps) => {
	return (
		<div className="empty-screen empty-card">
			<div className="empty-container">
				<div className="empty-card-wrapper">
					<div className="header">
						<span className="first-text">{title}</span>
						<span className="second-text">{info}</span>
					</div>
					<div className="button">
						<PrimaryButton
							text={buttonText ?? ''}
							click={(e) => {
								event?.();
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EmptyScreenView;
