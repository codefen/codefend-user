import { type FC } from 'react';

import type { IssuesCondition } from '../../../data';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { AnimatedCount } from '@/app/views/components/stat-asset/AnimatedCount';

export const VulnerabilitiesStatus: FC<{
  vulnerabilityByShare: IssuesCondition;
  isLoading?: boolean;
  animateMetrics?: boolean;
}> = props => {
  const total = props.vulnerabilityByShare.total ?? 0;
  const fixed = props.vulnerabilityByShare.fixed ?? 0;
  const open = props.vulnerabilityByShare.open ?? 0;
  const metric = (value: string | number, delay: number) =>
    props.animateMetrics ? <AnimatedCount value={value} delay={delay} /> : value;

  return (
    <div className="flex-box status-card-container">
      <StatAsset
        value={
          !(props.isLoading && !open) ? (
            <>
              <span className="codefend-text-red-200">{metric(open, 285)}</span>/
              {metric(total, 285)}
            </>
          ) : (
            -1
          )
        }
        valueTitle="Open issues"
        trend={total ? `${Math.round((open / Math.max(total, 1)) * 100)}% open` : undefined}
        isActive
      />
      <StatAsset
        value={
          !(props.isLoading && !fixed) ? (
            <>
              <span>{metric(fixed, 340)}</span>/{metric(total, 340)}
            </>
          ) : (
            -1
          )
        }
        valueTitle="Fixed issues"
        trend={total ? `${Math.round((fixed / Math.max(total, 1)) * 100)}% fixed` : undefined}
      />
      <StatAsset
        value={props.isLoading && !total ? -1 : metric(total, 395)}
        valueTitle="Total issues"
        trend={total ? 'tracked' : undefined}
      />
    </div>
  );
};
