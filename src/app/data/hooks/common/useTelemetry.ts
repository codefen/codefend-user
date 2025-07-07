import { useEffect, useRef } from 'react';
import { sendEventToGTM } from '@utils/gtm';

interface TelemetryEvent {
  event: string;
  category: string;
  action: string;
  label: string;
  demora?: number;
  demora_total?: number;
  tiempo_segundos?: number;
  [key: string]: any;
}

export const useTelemetry = () => {
  const sessionStartTime = useRef<number>(Date.now());
  const sectionStartTime = useRef<number>(Date.now());

  const trackEvent = (eventData: TelemetryEvent) => {
    const tiempoInicio = parseInt(sessionStorage.getItem("session_start") || "0");
    if (!tiempoInicio) {
      sessionStorage.setItem("session_start", Date.now().toString());
    }

    sendEventToGTM({
      ...eventData,
      demora_total: Date.now() - sessionStartTime.current,
    });
  };

  // Evento de telemetría: tiempo que el usuario pasa en una sección/página
  const trackSectionTime = (sectionName: string) => {
    const tiempoEnSeccion = Date.now() - sectionStartTime.current;
    trackEvent({
      event: "seccion_clock",
      category: "navegacion",
      action: "salir_seccion",
      label: sectionName,
      tiempo_segundos: Math.round(tiempoEnSeccion / 1000),
    });
  };

  const startSectionTimer = () => {
    sectionStartTime.current = Date.now();
  };

  return {
    trackEvent,
    trackSectionTime,
    startSectionTimer,
  };
}; 