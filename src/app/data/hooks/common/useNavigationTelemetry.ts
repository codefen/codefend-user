import { useTelemetry } from './useTelemetry';
import { TelemetryEvents } from '@/app/data/telemetry/customEvents';

export const useNavigationTelemetry = () => {
  const { trackEvent } = useTelemetry();

  // Evento de telemetría: usuario entra al dashboard
  const trackDashboardView = () => {
    trackEvent({
      event: TelemetryEvents.DASHBOARD_VIEW,
      category: "navegacion",
      action: "entrar_pagina",
      label: "dashboard",
    });
  };

  // Evento de telemetría: usuario entra a la lista de issues
  const trackIssuesIndex = () => {
    trackEvent({
      event: TelemetryEvents.ISSUES_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "issues_list",
    });
  };

  // Evento de telemetría: usuario visualiza un issue específico
  const trackIssuesView = (issueId: string, issueName: string) => {
    trackEvent({
      event: TelemetryEvents.ISSUES_VIEW,
      category: "navegacion",
      action: "ver_elemento",
      label: "issue_detail",
      issue_id: issueId,
      issue_nombre: issueName,
    });
  };

  // Evento de telemetría: usuario entra a la sección social
  const trackSocialIndex = () => {
    trackEvent({
      event: TelemetryEvents.SOCIAL_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "social_engineering",
    });
  };

  // Evento de telemetría: usuario entra a la sección de escaneos
  const trackScansIndex = () => {
    trackEvent({
      event: TelemetryEvents.SCANS_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "scans",
    });
  };

  // Evento de telemetría: usuario entra a talk to hacker
  const trackTalkToHackerIndex = () => {
    trackEvent({
      event: TelemetryEvents.TALK_TO_HACKER_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "talk_to_hacker",
    });
  };

  // Evento de telemetría: usuario entra a team members
  const trackTeamMembersIndex = () => {
    trackEvent({
      event: TelemetryEvents.TEAM_MEMBERS_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "team_members",
    });
  };

  // Evento de telemetría: usuario entra a user profile
  const trackUserProfileIndex = () => {
    trackEvent({
      event: TelemetryEvents.USER_PROFILE_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "user_profile",
    });
  };

  // Evento de telemetría: usuario entra a orders & payments
  const trackOrdersPaymentsIndex = () => {
    trackEvent({
      event: TelemetryEvents.ORDERS_PAYMENTS_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "orders_payments",
    });
  };

  // Evento de telemetría: usuario entra a network
  const trackNetworkIndex = () => {
    trackEvent({
      event: TelemetryEvents.NETWORK_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "network",
    });
  };

  // Evento de telemetría: usuario entra a web applications
  const trackWebIndex = () => {
    trackEvent({
      event: TelemetryEvents.WEB_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "web_applications",
    });
  };

  // Evento de telemetría: usuario entra a SNS
  const trackSnsIndex = () => {
    trackEvent({
      event: TelemetryEvents.SNS_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "sns",
    });
  };

  // Evento de telemetría: usuario entra a admin
  const trackAdminIndex = () => {
    trackEvent({
      event: TelemetryEvents.ADMIN_INDEX,
      category: "navegacion",
      action: "entrar_pagina",
      label: "admin",
    });
  };

  return {
    trackDashboardView,
    trackIssuesIndex,
    trackIssuesView,
    trackSocialIndex,
    trackScansIndex,
    trackTalkToHackerIndex,
    trackTeamMembersIndex,
    trackUserProfileIndex,
    trackOrdersPaymentsIndex,
    trackNetworkIndex,
    trackWebIndex,
    trackSnsIndex,
    trackAdminIndex,
  };
}; 