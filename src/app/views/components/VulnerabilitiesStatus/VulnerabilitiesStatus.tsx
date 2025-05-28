import { type FC } from 'react';

import type { IssuesCondition } from '../../../data';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';

export const VulnerabilitiesStatus: FC<{
  vulnerabilityByShare: IssuesCondition;
}> = props => {
  const renderMetrics = () => {
    return {
      total: props.vulnerabilityByShare.total ?? 0,
      fixed: props.vulnerabilityByShare.fixed ?? 0,
      open: props.vulnerabilityByShare.open ?? 0,
    };
  };
  return (
    <div className="flex-box">
      <StatAsset
        value={
          <>
            <span className="codefend-text-red-200">{renderMetrics().open}</span>
            {`/${renderMetrics().total}`}
          </>
        }
        valueTitle="Open issues"
        isActive
      />
      <StatAsset
        value={
          <>
            <span>{renderMetrics().fixed}</span>
            {`/${renderMetrics().total}`}
          </>
        }
        valueTitle="Fixed issues"
      />
      <StatAsset value={renderMetrics().total} valueTitle="Total issues" />
    </div>
  );
};
