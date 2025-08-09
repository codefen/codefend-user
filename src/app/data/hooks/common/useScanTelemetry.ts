import { useTelemetry } from './useTelemetry';

export const useScanTelemetry = () => {
  const { trackEvent } = useTelemetry();

  // Evento de telemetría: inicio de un escaneo
  const trackScanStart = (domain: string, scanType: 'web' | 'mobile' | 'network' | 'social') => {
    trackEvent({
      event: "scan_inicio",
      category: "escaneo",
      action: "iniciar_scan",
      label: scanType,
      dominio: domain,
    });
  };

  // Evento de telemetría: escaneo finalizado correctamente
  const trackScanComplete = (domain: string, scanType: string, issuesFound: number, leaksFound: number) => {
    trackEvent({
      event: "scan_completado",
      category: "escaneo",
      action: "finalizar_scan",
      label: scanType,
      dominio: domain,
      vulnerabilidades_encontradas: issuesFound,
      filtraciones_encontradas: leaksFound,
    });
  };

  // Evento de telemetría: error durante el escaneo
  const trackScanError = (domain: string, scanType: string, error: string) => {
    trackEvent({
      event: "scan_error",
      category: "escaneo",
      action: "error_scan",
      label: scanType,
      dominio: domain,
      error_tipo: error,
    });
  };

  // Evento de telemetría: escaneo cancelado por el usuario
  const trackScanKill = (domain: string, scanType: string) => {
    trackEvent({
      event: "scan_cancelado",
      category: "escaneo",
      action: "cancelar_scan",
      label: scanType,
      dominio: domain,
    });
  };

  // Evento de telemetría: el usuario visualiza una vulnerabilidad
  const trackVulnerabilityView = (issueId: string, issueName: string, riskScore: string) => {
    trackEvent({
      event: "vulnerabilidad_visualizada",
      category: "vulnerabilidades",
      action: "ver_vulnerabilidad",
      label: "detalle_issue",
      issue_id: issueId,
      issue_nombre: issueName,
      risk_score: riskScore,
    });
  };

  return {
    trackScanStart,
    trackScanComplete,
    trackScanError,
    trackScanKill,
    trackVulnerabilityView,
  };
}; 