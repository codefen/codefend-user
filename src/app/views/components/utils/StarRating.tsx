import { type FC } from 'react';
import './util.scss';
import { StarIcon } from '@icons';

interface StarRatingProps {
  rating?: number;
}

export const StarRating: FC<StarRatingProps> = ({ rating = 0 }) => {
  // Asegurarse de que el rating esté entre 0 y 5
  const normalizedRating = Math.min(5, Math.max(0, Number(rating) || 0));
  const fullStars = Math.floor(normalizedRating);
  const decimalPart = normalizedRating % 1;
  const hasHalfStar = decimalPart >= 0.25 && decimalPart < 0.75;
  const hasFullStar = decimalPart >= 0.75;

  const stars = [];

  // Estrellas completas
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} />);
  }

  // Media estrella o estrella completa adicional
  if (hasHalfStar) {
    stars.push(<StarIcon key="half" half percentage="50%" />);
  } else if (hasFullStar) {
    stars.push(<StarIcon key="full-extra" />);
  }

  // Estrellas vacías
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarIcon key={`empty-${i}`} empty />);
  }

  return <div className="rating-content">{stars}</div>;
};
