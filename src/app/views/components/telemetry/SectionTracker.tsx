import { useEffect } from 'react';
import { useTelemetry } from '@hooks/common/useTelemetry';

interface SectionTrackerProps {
  sectionName: string;
  children: React.ReactNode;
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