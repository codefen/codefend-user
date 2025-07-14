export const TelemetryEvents = {
  // Registro de usuarios (Signup)
  SIGNUP_ACCESS: 'usuario_creacion_acceso',
  SIGNUP_INFO_PERSONAL: 'usuario_creacion_informacion_personal',
  SIGNUP_INFO_EMPRESA: 'usuario_creacion_informacion_empresa',
  SIGNUP_REFERENCE_NUMBER: 'usuario_creacion_informacion_reference_number',
  SIGNUP_PASSWORD: 'usuario_creacion_informacion_password',
  SIGNUP_COMPLETE: 'usuario_creacion_finalizacion',

  // Inicio de sesión (Signin)
  SIGNIN_MFA_REQUIRED: 'inicio_sesion_mfa_requerido',
  SIGNIN_ERROR: 'inicio_sesion_error',
  SIGNIN_SUCCESS: 'inicio_sesion_valido',

  // Pagos
  PAYMENT_START: 'compra_inicio',
  PAYMENT_COMPLETE: 'compra_realizada',
  PAYMENT_ERROR: 'compra_error',
  PAYMENT_METHOD_SELECTED: 'compra_medio',

  // Escaneos
  SCAN_START: 'scan_inicio',
  SCAN_COMPLETE: 'scan_finalizado',
  SCAN_ERROR: 'scan_error',
  SCAN_CANCEL: 'scan_cancelado',

  // Vulnerabilidades
  VULNERABILITY_VIEW: 'vulnerabilidad_visualizada',

  // Métricas de navegación
  SECTION_TIME: 'seccion_clock',

  // Eventos de navegación - Entrada a páginas
  DASHBOARD_VIEW: 'dashboard_view',
  ISSUES_INDEX: 'issues_index',
  ISSUES_VIEW: 'issues_view',
  SOCIAL_INDEX: 'social_index',
  SCANS_INDEX: 'scans_index',
  TALK_TO_HACKER_INDEX: 'talk_to_hacker_index',
  TEAM_MEMBERS_INDEX: 'team_members_index',
  USER_PROFILE_INDEX: 'user_profile_index',
  ORDERS_PAYMENTS_INDEX: 'orders_payments_index',
  NETWORK_INDEX: 'network_index',
  WEB_INDEX: 'web_index',
  SNS_INDEX: 'sns_index',
  ADMIN_INDEX: 'admin_index',
} as const;

export type TelemetryEventKey = keyof typeof TelemetryEvents;
export type TelemetryEventValue = typeof TelemetryEvents[TelemetryEventKey];

/**
 * Devuelve un array con todos los eventos custom definidos
 * (útil para scripts de mantenimiento o validación de GTM).
 */
export const allTelemetryEventNames = (): string[] => Object.values(TelemetryEvents); 