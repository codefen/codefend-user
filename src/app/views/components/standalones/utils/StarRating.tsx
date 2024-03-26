import { type FC } from 'react';
import { HalfStarIcon, StarIcon } from '../..';
import './util.scss';

interface StartRatingProps {
	rating: number;
}

export const StarRating: FC<StartRatingProps> = ({ rating }) => {
	const stars = [];
	const ratingRounded = Math.floor(rating);
	const ratingDecimal = rating - ratingRounded;

	for (let i = 0; i < ratingRounded; i++) {
		stars.push(<StarIcon key={`star_${i}`} />);
	}

	if (ratingDecimal > 0) {
		stars.push(<StarIcon key={`halfstar_${stars.length}`} half />);
	}

	return <div className="rating-content">{stars}</div>;
};
