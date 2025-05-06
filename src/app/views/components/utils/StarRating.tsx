import { type FC } from 'react';
import './util.scss';
import { StarIcon } from '@icons';

interface StartRatingProps {
  rating?: number;
}

const calculateStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasPartialStar = rating % 1 !== 0;
  const partialStarPercentage = hasPartialStar ? Math.round((rating % 1) * 100) : 0;

  return { fullStars, hasPartialStar, partialStarPercentage };
};

export const StarRating: FC<StartRatingProps> = ({ rating = 0 }) => {
  const { fullStars, hasPartialStar, partialStarPercentage } = calculateStars(rating);
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<StarIcon key={`star_${i}`} />);
    } else if (i === fullStars && hasPartialStar) {
      stars.push(
        <StarIcon key={`partialStar_${i}`} percentage={`${partialStarPercentage}%`} half />
      );
    } else {
      stars.push(<StarIcon key={`emptyStar_${i}`} />);
    }
  }

  return <div className="rating-content">{stars}</div>;
};
