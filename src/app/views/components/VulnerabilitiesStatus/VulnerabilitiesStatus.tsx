import { type FC } from 'react';

import type { IssuesCondition } from '../../../data';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';

export const VulnerabilitiesStatus: FC<{
  vulnerabilityByShare: IssuesCondition;
  isLoading?: boolean;
}> = props => {
  const renderMetrics = () => {
    return {
      total: props.vulnerabilityByShare.total ?? 0,
      fixed: props.vulnerabilityByShare.fixed ?? 0,
      open: props.vulnerabilityByShare.open ?? 0,
    };
  };
  const showSkeletonTotal = props.isLoading && !renderMetrics().total;
  const showSkeletonFixed = props.isLoading && !renderMetrics().fixed;
  const showSkeletonOpen = props.isLoading && !renderMetrics().open;

  return (
    <div className="flex-box status-card-container">
      <StatAsset
        value={
          !showSkeletonOpen ? (
            <>
              <span className="codefend-text-red-200">{renderMetrics().open}</span>
              {`/${renderMetrics().total}`}
            </>
          ) : (
            -1
          )
        }
        valueTitle="Open issues"
        isActive
      />
      <StatAsset
        value={
          !showSkeletonFixed ? (
            <>
              <span>{renderMetrics().fixed}</span>
              {`/${renderMetrics().total}`}
            </>
          ) : (
            -1
          )
        }
        valueTitle="Fixed issues"
      />
      <StatAsset
        value={!showSkeletonTotal ? renderMetrics().total : -1}
        valueTitle="Total issues"
      />
    </div>
  );
};
