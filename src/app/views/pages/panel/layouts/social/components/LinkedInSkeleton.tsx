import { memo, useMemo, type FC } from 'react';
import { LinkedinV2Icon, EmailIcon } from '@icons';

const SKELETON_CONFIG = {
  minCards: 4,
  maxCards: 8,
  cardHeight: 100,
} as const;

interface LinkedInSkeletonProps {
  count?: number;
}

const LinkedInSkeleton: FC<LinkedInSkeletonProps> = ({ count = 6 }) => {
  const skeletonCardCount = useMemo(() => {
    return Math.max(
      Math.min(count, SKELETON_CONFIG.maxCards),
      SKELETON_CONFIG.minCards
    );
  }, [count]);

  return (
    <div className="card">
      <div className="linkedin-profiles-grid">
        {Array.from({ length: skeletonCardCount }).map((_, index) => (
          <div
            key={index}
            className="linkedin-profile-card skeleton-linkedin-card"
            style={{ minHeight: `${SKELETON_CONFIG.cardHeight}px` }}
          >
            {/* Imagen skeleton */}
            <div className="linkedin-profile-image">
              <div className="skeleton-profile-image"></div>
            </div>

            {/* Información skeleton */}
            <div className="linkedin-profile-info">
              <div className="linkedin-profile-name">
                <div className="skeleton-text skeleton-name-text"></div>
              </div>
              <div className="linkedin-profile-url">
                <div className="skeleton-linkedin-icon">
                  <LinkedinV2Icon width="16" height="16" />
                </div>
                <div className="skeleton-text skeleton-url-text"></div>
              </div>
              <div className="linkedin-profile-email">
                <div className="skeleton-email-icon">
                  <EmailIcon width="16" height="16" />
                </div>
                <div className="skeleton-text skeleton-email-text"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(LinkedInSkeleton); 