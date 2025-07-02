import { useEffect, type ReactNode } from 'react';
import { useTelemetry } from '@hooks/common/useTelemetry';

interface SectionTrackerProps {
  sectionName: string;
  children: ReactNode;
}

export const SectionTracker = ({ sectionName, children }: SectionTrackerProps) => {
  const { trackSectionTime, startSectionTimer } = useTelemetry();

  useEffect(() => {
    startSectionTimer();

    return () => {
      trackSectionTime(sectionName);
    };
  }, [sectionName]);

  return <>{children}</>;
};
