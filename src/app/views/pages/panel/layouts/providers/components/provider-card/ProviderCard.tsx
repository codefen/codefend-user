import type { FC } from 'react';
import { StarRating } from '@standalones/utils/StarRating.tsx';
import { ProfileMedia } from '@standalones/utils/ProfileMedia.tsx';
import './providercard.scss';

interface ProviderCardProps {
	img: string;
	name: string;
	username: string;
	desc: string;
	score: number | string;
	totalReviews: string;
	handleActivate: (id: string) => void;
	id: string;
	isSelected?: boolean;
}

export const ProviderCard: FC<ProviderCardProps> = ({
	img,
	name,
	desc,
	score,
	totalReviews,
	username,
	handleActivate,
	id,
	isSelected,
}) => {
	const onClick = () => handleActivate(id);
	return (
		<article
			className={`provider-card ${isSelected && 'active'}`}
			onClick={onClick}>
			<ProfileMedia
				src={img}
				size="70px"
				top=".75rem"
				left="1rem"
				activeGrayScale
			/>
			<div className="provider-card-content">
				<div className="provider-name">
					<h3>
						<b>{name} </b>|{' '}
						<span className="codefend-text-red">@{username}</span>
					</h3>
				</div>
				<span className="provider-desc">{desc}</span>
				<span className="provider-score">
					<span className="score-info">{score} score</span>
					<span className="score-review">
						{totalReviews} reviews <StarRating rating={Number(score)} />
					</span>
				</span>
			</div>
		</article>
	);
};
