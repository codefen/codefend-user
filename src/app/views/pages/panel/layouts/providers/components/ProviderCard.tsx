import type { FC } from 'react';
import { ProfileMedia, StarRating } from '../../../../../components';

interface ProviderCardProps {
	img: string;
	name: string;
	username: string;
	desc: string;
	score: number | string;
	rating: number;
	totalReviews: string;
}

export const ProviderCard: FC<ProviderCardProps> = ({
	img,
	name,
	desc,
	rating,
	score,
	totalReviews,
	username,
}) => (
	<article className="provider-card">
		<ProfileMedia src={img} size="70px" top=".75rem" left="1rem" />
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
					{totalReviews} reviews <StarRating rating={rating} />
				</span>
			</span>
		</div>
	</article>
);
