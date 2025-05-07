import React, { useEffect, useMemo } from 'react';

interface DownloadsCardProps {
  className?: string;
  appData?: {
    total_downloads?: string | number; // Puede ser string (ej: '10k', '5m', '100 M+') o number
    app_android_downloads?: string | number;
    app_ios_downloads?: string | number;
  };
}

// Función para formatear números con separadores de miles
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Función para convertir diferentes formatos de descargas a número
const parseDownloadCount = (downloads: any): number => {
  if (downloads === undefined || downloads === null) {
    return 0;
  }

  // Si ya es un número, devolverlo redondeado
  if (typeof downloads === 'number') {
    return Math.floor(downloads);
  }

  // Si es string, intentar convertir a número
  if (typeof downloads === 'string') {
    // Limpiar el string
    const cleaned = downloads
      .replace(/&Acirc;/g, '')
      .replace(/&nbsp;/g, '')
      .replace(/[^\d.kKmM+]/g, '')
      .trim();

    // Extraer número y unidad
    const match = cleaned.match(/^(\d+(?:\.\d+)?)([kKmM]?)\+?$/);
    if (!match) return 0;

    const [, numberStr, unit] = match;
    const number = parseFloat(numberStr);

    // Convertir según la unidad
    switch (unit.toLowerCase()) {
      case 'k':
        return Math.floor(number * 1000);
      case 'm':
        return Math.floor(number * 1000000);
      default:
        return Math.floor(number);
    }
  }

  return 0;
};

// Función para obtener el texto de comparación según el número de descargas
const getComparisonText = (count: number): { text: string; isMillions: boolean } => {
  if (count < 1000) return { text: 'menos de 1.000', isMillions: false };
  if (count < 10000) return { text: 'más de 1.000', isMillions: false };
  if (count < 100000) return { text: 'más de 10.000', isMillions: false };
  if (count < 500000) return { text: 'más de 100.000', isMillions: false };
  if (count < 1000000) return { text: 'más de 500.000', isMillions: false };
  if (count < 2000000) return { text: 'más de 1.000.000', isMillions: true };
  if (count < 5000000) return { text: 'más de 1.000.000', isMillions: true };
  if (count < 10000000) return { text: 'más de 5.000.000', isMillions: true };
  if (count < 50000000) return { text: 'más de 10.000.000', isMillions: true };
  if (count < 100000000) return { text: 'más de 50.000.000', isMillions: true };
  return { text: 'más de 100.000.000', isMillions: true };
};

// Función para formatear el mensaje de descargas
const getDownloadMessage = (downloads: any): string => {
  const count = parseDownloadCount(downloads);

  if (count === 0) {
    return 'Esta aplicación no cuenta con información de descargas';
  }

  const { text: comparison, isMillions } = getComparisonText(count);

  if (count < 1000000) {
    return `Esta aplicación tiene ${comparison} mil descargas`;
  } else {
    const millonText = comparison.includes('1.000.000') ? 'millón' : 'millones';
    return `Esta aplicación tiene ${comparison} ${millonText} de descargas`;
  }
};

export const DownloadsCard: React.FC<DownloadsCardProps> = ({ className, appData }) => {
  // Obtener las descargas, intentando primero con total_downloads, luego con Android y finalmente con iOS
  const downloadCount =
    appData?.total_downloads || appData?.app_android_downloads || appData?.app_ios_downloads;

  // Obtener el mensaje de descargas
  const downloadMessage = useMemo(() => {
    return getDownloadMessage(downloadCount);
  }, [downloadCount]);

  // Debug: Mostrar información sobre los datos de descargas
  useEffect(() => {
    console.log('=== DOWNLOADS CARD DEBUG ===');
    console.log('Datos de entrada (appData):', appData);
    console.log('Total downloads:', appData?.total_downloads);
    console.log('Android downloads:', appData?.app_android_downloads);
    console.log('iOS downloads:', appData?.app_ios_downloads);
    console.log('Valor usado (downloadCount):', downloadCount);
    console.log('Mensaje generado:', downloadMessage);
    console.log('===========================');
  }, [appData, downloadCount, downloadMessage]);

  // Debug: Mostrar información sobre los datos de descargas
  useEffect(() => {
    console.log('=== DOWNLOADS CARD DEBUG ===');
    console.log('Datos de entrada (downloadCount):', downloadCount);
    console.log('Tipo de dato:', typeof downloadCount);
    console.log('Mensaje generado:', downloadMessage);
    console.log('===========================');
  }, [downloadCount, downloadMessage]);

  return (
    <div className={`downloads-card ${className || ''}`}>
      <div className="downloads-content">
        <span className="downloads-text">{downloadMessage}</span>
      </div>
    </div>
  );
};

export default DownloadsCard;
