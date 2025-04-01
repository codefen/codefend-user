import React from 'react';
import { SimpleSection } from '@defaults/SimpleSection';
import { ChartIcon } from '@icons';

import type { IssuesCondition } from '../../../data';
import { StatAsset } from '@/app/views/pages/auth/newRegister/stat-asset/StatAsset';

export const VulnerabilitiesStatus: React.FC<{
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
    <div className="card stats">
      <SimpleSection header="Issue by status" icon={<ChartIcon />}>
        <div className="content">
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
      </SimpleSection>
    </div>
  );
};
