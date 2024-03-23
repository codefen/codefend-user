import { type FC } from 'react';
import { PrimaryButton } from '..';

interface EmptyScreenProps {
	title?: string;
	info?: string;
	buttonText?: string;
	event?: () => void;
}

const EmptyScreenView: FC<EmptyScreenProps> = ({
	title,
	info,
	buttonText,
	event,
}) => {
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
							click={() => {
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
