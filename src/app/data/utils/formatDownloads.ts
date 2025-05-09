/**
 * Limpia un texto eliminando caracteres especiales HTML y espacios innecesarios
 */
const cleanText = (text: string): string => {
  if (!text) return '';

  // Primero, convertir entidades HTML a sus caracteres correspondientes
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  let cleaned = textArea.value;

  // Reemplazar caracteres especiales específicos que hemos visto en los logs
  cleaned = cleaned
    .replace(/&Acirc;/g, '') // Eliminar caracteres especiales
    .replace(/&nbsp;/g, '') // Eliminar espacios no rompibles
    .replace(/\s+/g, '') // Eliminar espacios en blanco
    .replace(/[^\d.M+]/g, '') // Mantener solo números, puntos, M y +
    .trim();

  return cleaned;
};

/**
 * Convierte un número con sufijo a su valor numérico completo
 * Ejemplos:
 * - '10k' -> 10000
 * - '5m' -> 5000000
 * - '100M+' -> 100000000
 * - '1.5k' -> 1500
 * - '100&Acirc;&nbsp;M+' -> 100000000
 */
const parseSuffixedNumber = (text: string): number | null => {
  if (!text) return null;

  // Manejar el formato específico que vimos en los logs: '100&Acirc;&nbsp;M+'
  const specialFormatMatch = text.match(/^(\d+).*M\+?$/i);
  if (specialFormatMatch) {
    return Math.floor(parseFloat(specialFormatMatch[1]) * 1000000);
  }

  // Manejar formato con M+ (ej: '100M+' o '100M')
  const mPlusMatch = text.match(/^(\d+(?:\.\d+)?)M\+?$/i);
  if (mPlusMatch) {
    return Math.floor(parseFloat(mPlusMatch[1]) * 1000000);
  }

  // Manejar formato con k (ej: '10k' o '1.5k')
  const kMatch = text.match(/^(\d+(?:\.\d+)?)k$/i);
  if (kMatch) {
    return Math.floor(parseFloat(kMatch[1]) * 1000);
  }

  // Manejar formato con m (millones, ej: '5m')
  const mMatch = text.match(/^(\d+(?:\.\d+)?)m$/i);
  if (mMatch) {
    return Math.floor(parseFloat(mMatch[1]) * 1000000);
  }

  // Si es solo un número, devolverlo como número entero
  const numberMatch = text.match(/^(\d+)$/);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }

  return null;
};

/**
 * Formatea un número de descargas, manejando diferentes formatos de entrada
 * y devolviendo siempre el número completo formateado con separadores de miles
 */
export const formatDownloads = (downloads: string | number | undefined): string => {
  // Debug

  if (downloads === undefined || downloads === null || downloads === '') {
    return '0';
  }

  // Si ya es un número, formatearlo directamente
  if (typeof downloads === 'number') {
    return downloads.toLocaleString('es-AR');
  }

  // Limpiar el texto
  const cleanedText = cleanText(downloads);

  // Intentar analizar como número con sufijo
  const parsedNumber = parseSuffixedNumber(cleanedText);
  if (parsedNumber !== null) {
    return parsedNumber.toLocaleString('es-AR');
  }

  // Si no se pudo analizar, intentar extraer solo números
  const numbersOnly = cleanedText.replace(/[^\d]/g, '');
  if (numbersOnly) {
    return parseInt(numbersOnly, 10).toLocaleString('es-AR');
  }

  // Si todo falla, devolver 0
  return '0';
};
