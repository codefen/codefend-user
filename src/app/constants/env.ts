/**
 * 🔧 ARCHIVO DICCIONARIO DE VARIABLES DE ENTORNO
 * 
 * Este archivo es el DICCIONARIO que mapea las variables de entorno del .env
 * al objeto ENV utilizado en toda la aplicación:
 * 
 * .env file:                    →    Código TypeScript:
 * VITE_GOOGLE_CLIENT_ID=xxx     →    ENV.GOOGLE_CLIENT_ID
 * VITE_API_BASE_URL=yyy         →    ENV.API_BASE_URL
 * VITE_APP_ENV=zzz              →    ENV.APP_ENV
 * 
 * Configuración de Variables de Entorno
 * 
 * Este archivo centraliza todas las variables de entorno utilizadas en la aplicación.
 * Proporciona valores por defecto y validación básica.
 * 
 * Variables requeridas:
 * - VITE_GOOGLE_CLIENT_ID: Client ID de Google OAuth
 * - VITE_API_BASE_URL: URL base de la API
 * 
 * @author Codefend Team
 * @version 1.0
 */

// Función helper para obtener variables de entorno con fallback
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined') {
    // En el navegador, usar import.meta.env
    return (import.meta as any).env?.[key] || defaultValue;
  }
  // En el servidor, usar process.env (si está disponible)
  return (typeof process !== 'undefined' ? process.env?.[key] : undefined) || defaultValue;
};

export const ENV = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID'),
  
  // API Configuration
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://api.codefend.com'),
  
  // App Environment
  APP_ENV: getEnvVar('VITE_APP_ENV', 'development'),
  
  // Feature Flags
  ENABLE_GOOGLE_AUTH: getEnvVar('VITE_ENABLE_GOOGLE_AUTH', 'true') === 'true',
  
  // Debug Mode
  DEBUG: getEnvVar('VITE_DEBUG', 'false') === 'true',
} as const;

// Validación de variables críticas
export const validateEnvironment = (): void => {
  const requiredVars = {
    'GOOGLE_CLIENT_ID': ENV.GOOGLE_CLIENT_ID,
    'API_BASE_URL': ENV.API_BASE_URL,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value || value.includes('YOUR_'))
    .map(([key]) => key);

  if (missingVars.length > 0 && ENV.APP_ENV === 'production') {
    console.warn('Missing environment variables:', missingVars);
  }
};

// Ejecutar validación al importar
validateEnvironment(); 