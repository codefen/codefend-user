import { type FC, type ReactNode } from 'react';

import type { IssuesCondition } from '../../../data';
import { AnimatedCount } from '@/app/views/components/stat-asset/AnimatedCount';
import './vulnerabilitiesStatus.scss';

export const VulnerabilitiesStatus: FC<{
  vulnerabilityByShare: IssuesCondition;
  isLoading?: boolean;
  animateMetrics?: boolean;
}> = props => {
  const fixed = props.vulnerabilityByShare.fixed ?? 0;
  const open = props.vulnerabilityByShare.open ?? 0;

  const metric = (value: string | number, delay: number): ReactNode =>
    props.animateMetrics ? <AnimatedCount value={value} delay={delay} /> : value;

  const isSkeleton = Boolean(props.isLoading && !open && !fixed);

  return (
    <div className={`card vulnerability-status-card ${isSkeleton ? 'skeleton-stat' : ''}`}>
      <div className="vuln-status-grid">
        <div className="vuln-status-tile">
          <span className="vuln-status-value">{isSkeleton ? '—' : metric(open, 285)}</span>
          <span className="vuln-status-label">Open issues</span>
        </div>
        <div className="vuln-status-tile">
          <span className="vuln-status-value">{isSkeleton ? '—' : metric(fixed, 340)}</span>
          <span className="vuln-status-label">Fixed issues</span>
        </div>
      </div>
    </div>
  );
};
