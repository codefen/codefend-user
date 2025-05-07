import React, { useEffect, useMemo } from 'react';

interface DownloadsCardProps {
  className?: string;
  appData?: {
    total_downloads?: string | number; // Puede ser string (ej: '10k', '5m', '100 M+') o number
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

// Función para formatear el mensaje de descargas
const getDownloadMessage = (downloads: any): string => {
  const count = parseDownloadCount(downloads);

  if (count === 0) {
    return 'Esta aplicación no cuenta con información de descargas';
  }

  return `Esta aplicación cuenta con ${formatNumber(count)} descargas`;
};

export const DownloadsCard: React.FC<DownloadsCardProps> = ({ className, appData }) => {
  const downloadCount = appData?.total_downloads;

  // Obtener el mensaje de descargas
  const downloadMessage = useMemo(() => {
    return getDownloadMessage(downloadCount);
  }, [downloadCount]);

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
