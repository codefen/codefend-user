import { type FC } from 'react';
import { HalfStarIcon, StarIcon } from '../..';
import './util.scss';

interface StartRatingProps {
	rating?: number;
}

const calculateStars = (rating: number) => {
	const fullStars = Math.floor(rating);
	const hasPartialStar = rating % 1 !== 0;
	const partialStarPercentage = hasPartialStar ? (rating % 1) * 100 : 0;

	return { fullStars, hasPartialStar, partialStarPercentage };
};

export const StarRating: FC<StartRatingProps> = ({ rating = 0 }) => {
	const { fullStars, hasPartialStar, partialStarPercentage } =
		calculateStars(rating);
	const stars = [];
	const ratingRounded = Math.floor(rating);
	const ratingDecimal = rating - ratingRounded;

	for (let i = 0; i < fullStars; i++) {
		stars.push(<StarIcon key={`star_${i}`} />);
	}

	if (hasPartialStar) {
		stars.push(
			<StarIcon
				key={`partialStar_${fullStars}`}
				percentage={`${partialStarPercentage}%`}
				half
			/>,
		);
	}

	return <div className="rating-content">{stars}</div>;
};
