import { ScanStepType } from '@/app/constants/welcome-steps';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useEffect, useRef, useState } from 'react';

export const useScanProgress = () => {
  const { scanStep, issueScanFound, issuesParsed } = useWelcomeStore();

  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const progressRef = useRef(0);
  const scanProgress = useGlobalFastField('scanProgress');

  useEffect(() => {
    let progressInterval: any;
    if (scanStep === 'scanner') {
      if (progressRef.current === 0) {
        progressRef.current = scanProgress.get; // Mantiene el progreso previo si no estaba en 0
      }

      progressInterval = setInterval(() => {
        // Incremento gradual que se desacelera a medida que se acerca al 20%
        const increment = 0.5 * (1 - progressRef.current / 25);
        progressRef.current = Math.min(progressRef.current + increment, 25);
        scanProgress.set(progressRef.current);
      }, 2300);
    } else if (scanStep === 'parser') {
      // En la fase de parseo, comenzamos en 30% y avanzamos hasta 90% basado en el progreso del parseo
      // Calculamos el progreso basado en vulnerabilidades parseadas vs encontradas
      const baseProgress = 25;
      const maxParsingProgress = 99;
      const parsingProgressRange = maxParsingProgress - baseProgress;

      // Calculamos el progreso actual del parseo
      const parsingRatio = issueScanFound > 0 ? issuesParsed / issueScanFound : 0;

      scanProgress.set(baseProgress + parsingRatio * parsingProgressRange);
      // Calculamos tiempo estimado (entre 1-2 minutos por vulnerabilidad)
      // Usamos un enfoque probabilístico para estimar el tiempo
      const remainingVulnerabilities = issueScanFound - issuesParsed;
      const minTime = remainingVulnerabilities; // Mínimo 1 minuto por vulnerabilidad
      const maxTime = remainingVulnerabilities * 2; // Máximo 2 minutos por vulnerabilidad

      // Estimación de tiempo que considera el rango y se ajusta según el progreso actual
      // A medida que avanzamos, podemos refinar la estimación basada en el tiempo real
      const completionRatio = issuesParsed / Math.max(issueScanFound, 1);
      const adjustedEstimate = minTime + (maxTime - minTime) * (1 - completionRatio);

      setEstimatedTime(Math.ceil(adjustedEstimate));
    } else if (scanStep === 'finished' || scanStep === 'nonScan') {
      // En la fase de finalización, avanzamos del 90% al 100%
      let finalizingProgress = 90;

      progressInterval = setInterval(() => {
        // Incremento gradual que se acelera a medida que se acerca al 100%
        const increment = 0.2 * (1 + (finalizingProgress - 90) / 10);
        finalizingProgress = Math.min(finalizingProgress + increment, 99.9);
        scanProgress.set(finalizingProgress);
      }, 1000);

      setEstimatedTime(null);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [scanStep, issueScanFound, issuesParsed]);

  return { progress: scanProgress.get, estimatedTime };
};
