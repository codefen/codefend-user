import { useMemo, type FC } from 'react';

interface DownloadsCardProps {
  className?: string;
  appData?: {
    total_downloads?: string | number;
    app_android_downloads?: string | number;
    app_ios_downloads?: string | number;
  };
}

// Función para convertir diferentes formatos de descargas a número
const parseDownloadCount = (downloads: any): { count: number; unit: string } => {
  if (downloads === undefined || downloads === null) {
    return { count: 0, unit: '' };
  }

  // Si ya es un número, determinar la unidad
  if (typeof downloads === 'number') {
    if (downloads >= 1000000000) {
      return { count: downloads, unit: 'billion' };
    } else if (downloads >= 1000000) {
      return { count: downloads, unit: 'million' };
    } else if (downloads >= 1000) {
      return { count: downloads, unit: 'thousand' };
    }
    return { count: downloads, unit: '' };
  }

  // Si es string, intentar convertir a número
  if (typeof downloads === 'string') {
    // Limpiar el string
    const cleaned = downloads
      .replace(/&Acirc;/g, '')
      .replace(/&nbsp;/g, '')
      .replace(/[^\d.kKmMbB+]/g, '')
      .trim();

    // Extraer número y unidad
    const match = cleaned.match(/^(\d+(?:\.\d+)?)([kKmMbB]?)\+?$/);
    if (!match) return { count: 0, unit: '' };

    const [, numberStr, unit] = match;
    const number = parseFloat(numberStr);

    // Convertir según la unidad
    switch (unit.toLowerCase()) {
      case 'k':
        return { count: number * 1000, unit: 'thousand' };
      case 'm':
        return { count: number * 1000000, unit: 'million' };
      case 'b':
        return { count: number * 1000000000, unit: 'billion' };
      default:
        return { count: number, unit: '' };
    }
  }

  return { count: 0, unit: '' };
};

// Función para formatear el mensaje de descargas
const getDownloadMessage = (downloads: any): string => {
  const { count, unit } = parseDownloadCount(downloads);

  if (count === 0) {
    return 'This application has no download information';
  }

  const formattedCount = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(count);
  const unitText = unit ? ` ${unit}` : '';
  const pluralSuffix = count !== 1 ? 's' : '';

  return `This application has more than ${formattedCount} download${pluralSuffix}`;
};

export const DownloadsCard: FC<DownloadsCardProps> = ({ className, appData }) => {
  // Obtener las descargas, intentando primero con total_downloads, luego con Android y finalmente con iOS
  const downloadCount =
    appData?.total_downloads || appData?.app_android_downloads || appData?.app_ios_downloads;

  // Obtener el mensaje de descargas
  const downloadMessage = useMemo(() => {
    return getDownloadMessage(downloadCount);
  }, [downloadCount]);

  return (
    <div className={`downloads-card ${className || ''}`}>
      <div className="downloads-content">
        <span className="downloads-text">{downloadMessage}</span>
      </div>
    </div>
  );
};

export default DownloadsCard;
