import { useEffect, type ReactNode } from 'react';
import { useTelemetry } from '@hooks/common/useTelemetry';
import { useNavigationTelemetry } from '@hooks/common/useNavigationTelemetry';

interface SectionTrackerProps {
  sectionName: string;
  children: ReactNode;
}

export const SectionTracker = ({ sectionName, children }: SectionTrackerProps) => {
  const { trackSectionTime, startSectionTimer } = useTelemetry();
  const navigationTelemetry = useNavigationTelemetry();

  useEffect(() => {
    startSectionTimer();

    // Evento de telemetría: usuario entra a la página/sección
    const trackPageEntry = () => {
      switch (sectionName) {
        case 'dashboard':
          navigationTelemetry.trackDashboardView();
          break;
        case 'issues':
          navigationTelemetry.trackIssuesIndex();
          break;
        case 'social':
          navigationTelemetry.trackSocialIndex();
          break;
        case 'scans':
          navigationTelemetry.trackScansIndex();
          break;
        case 'talk-to-hacker':
          navigationTelemetry.trackTalkToHackerIndex();
          break;
        case 'team-members':
          navigationTelemetry.trackTeamMembersIndex();
          break;
        case 'user-profile':
          navigationTelemetry.trackUserProfileIndex();
          break;
        case 'orders-payments':
          navigationTelemetry.trackOrdersPaymentsIndex();
          break;
        case 'network':
          navigationTelemetry.trackNetworkIndex();
          break;
        case 'web':
          navigationTelemetry.trackWebIndex();
          break;
        case 'sns':
          navigationTelemetry.trackSnsIndex();
          break;
        case 'admin':
          navigationTelemetry.trackAdminIndex();
          break;
        default:
          // Para secciones no mapeadas, no generamos evento
          break;
      }
    };

    // Disparar evento de entrada inmediatamente
    trackPageEntry();

    return () => {
      // Evento de telemetría: usuario sale de la página/sección
      trackSectionTime(sectionName);
    };
  }, [sectionName]);

  return <>{children}</>;
};
