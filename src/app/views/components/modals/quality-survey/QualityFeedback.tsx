import type { FC, PropsWithChildren } from 'react';
import { ModalWrapper } from '..';
import Show from '@defaults/Show';
import { ProfileMedia } from '@standalones/utils/ProfileMedia';
import { StarRating } from '@standalones/utils/StarRating';
import { PrimaryButton } from '../..';
import { ModalGradientHeader } from './QualityFeedbackHeader';

interface QualityFeedbackProps extends PropsWithChildren {
	isActive: boolean;
	onClose: () => void;
	onNext: () => void;
	providerImg: string;
	name: string;
	username: string;
	score: string;
	reviews: string;
	desc: string;
	specialist: string;
	title: string;
	question: string;
	isFinish?: boolean;
}

export const QualityFeedback: FC<QualityFeedbackProps> = ({
	isActive,
	onClose,
	onNext,
	name,
	providerImg,
	username,
	score,
	reviews,
	desc,
	specialist,
	title,
	question,
	children,
	isFinish,
}) => {
	const experience = `How was your experience with ${name}?`;
	return (
		<Show when={isActive}>
			<ModalWrapper action={onClose} type="quality-survey-modal">
				<ModalGradientHeader header="The pentest has been finished!" />
				<h3>{experience}</h3>
				<div className="quality-provider-info">
					<ProfileMedia
						src={providerImg}
						size="70px"
						top=".75rem"
						left="1rem"
					/>
					<div className="provider-info-content">
						<div className="provider-info-header">
							<span className="provider-name">{name}</span>
							<span className="provider-username">@{username}</span>
							<StarRating rating={Number(score)} />
							<span className="provider-score">{score} score</span>
							<span className="provider-score">| {reviews} reviews</span>
						</div>
						<p className="provider-desc">{desc}</p>
						<div className="provider-specialist">
							<span className="codefend-text-red underline-high">
								Match:
							</span>
							<span className="specialist">
								Specialized in <b>{specialist} resource</b>
							</span>
						</div>
					</div>
				</div>
				<div className="quality-feedback-option">
					<h3>{title}</h3>
					<p>{question}</p>
					{children}
				</div>
				<div className="quality-btn-container">
					<Show when={Boolean(isFinish)}>
						<PrimaryButton
							text="no thanks"
							buttonStyle="red"
							className="quality-no-thanks"
							click={onClose}
							disabledLoader
						/>
					</Show>
					<PrimaryButton
						text={!isFinish ? 'continues' : 'send recommendation'}
						buttonStyle="dark-red"
						className="quality-btn"
						click={onNext}
						disabledLoader
					/>
				</div>
			</ModalWrapper>
		</Show>
	);
};
