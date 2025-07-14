import { memo, useMemo, type FC } from 'react';
import { LinkedinV2Icon } from '@/app/views/components/icons/LinkedinV2Icon';

const SKELETON_CONFIG = {
  minCards: 6,
  maxCards: 12,
  cardHeight: 35,
  estimatedCardsPerRow: 2,
} as const;

interface SocialSkeletonProps {
  count?: number;
}

const SocialSkeleton: FC<SocialSkeletonProps> = ({ count = 8 }) => {
  const skeletonCardCount = useMemo(() => {
    return Math.max(
      Math.min(count, SKELETON_CONFIG.maxCards),
      SKELETON_CONFIG.minCards
    );
  }, [count]);

  return (
    <div className="social-grid">
      {Array.from({ length: skeletonCardCount }).map((_, index) => (
        <div
          key={index}
          className="social-card skeleton-social-card"
          style={{ height: `${SKELETON_CONFIG.cardHeight}px` }}
        >
          <div className="social-card-info">
            <span className="skeleton-text skeleton-id"></span>
            <span className="separator">|</span>
            <span className="skeleton-text skeleton-email"></span>
            <span className="separator">|</span>
            <span className="skeleton-text skeleton-name"></span>
            {/* Simular algunos cards con LinkedIn */}
            {index % 3 === 0 && (
              <>
                <span className="separator">|</span>
                <div className="skeleton-linkedin-icon">
                  <LinkedinV2Icon />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(SocialSkeleton); 