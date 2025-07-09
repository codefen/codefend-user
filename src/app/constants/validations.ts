import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from './app-toast-texts';

/* 
    VALIDACIONES GENERALES / TRANSVERSALES
*/
//Cuando la api falla suele enviar "error" con valor 1 o "response" con el valor de "error"
export const apiErrorValidation = (data?: any) =>
  data?.error == '1' ||
  data?.response === 'error' ||
  data?.isAnError ||
  data?.isNetworkError ||
  Boolean(data?.error_info);

export const companyIdIsNull = (companyID?: any) => {
  if (!companyID) {
    return true;
  }
  return false;
};

export const verifySession = (res: any, logout: any) => {
  if (res?.error == 1 && String(res.info).startsWith('invalid or expired')) {
    toast.error(APP_MESSAGE_TOAST.SESSION_EXPIRED);
    logout();
    return true;
  }
  return false;
};

/* 
 PATTERN REGEX
*/
export const emailRegexVal =
  /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/;

export const phoneNumberRegexVal =
  /^\+?((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){2,13}\d$/;

export const passwordRegexVal = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{12,}$/;

export const upperCaseRegexVal = /[A-Z]/;
export const lowerCaseRegexVal = /[a-z]/;
export const specialCharRegexVal = /[!@#$%^&*(),.?":{}|<>]/;
export const numberRegexVAL = /\d/;

/*
ESTAS VALIDACIONES SOLO VALIDAN SI EL TEXTO NO ESTA VACIO
*/
export const phoneNumberValidation = (phone?: string) =>
  phone?.trim() !== '' && !phoneNumberRegexVal.test(phone || '');
export const nameValidation = (name?: string) => name && name?.trim() !== '' && name.length > 100;

export const androidUriValidation = (address: string) =>
  address.trim() !== '' && !address.startsWith('https://play.google.com');
export const iosUriValidation = (address: string) =>
  address.trim() !== '' && !address.startsWith('https://apps.apple.com');

/*
ESTAS VALIDACIONES VALIDAN DATOS QUE NO DEBEN ESTAR VACIAS
*/
export const hasEmail = (email: string) => isNotEmpty(email) && emailRegexVal.test(email);
export const isNotEmpty = (data?: string) => !!data && data?.trim() !== '';
export const isEquals = (source1?: string, source2?: string) => source1 == source2;
export const hasUpperCase = (str?: string) => !!str && upperCaseRegexVal.test(str);
export const hasLowerCase = (str?: string) => !!str && lowerCaseRegexVal.test(str);
export const hasSpecialChar = (str?: string) => !!str && specialCharRegexVal.test(str);
export const hasStrNumber = (str?: string) => !!str && numberRegexVAL.test(str);
export const hasMinChars = (str: string, minLength: number) => !!str && str.length >= minLength;

export const passwordValidation = (pass: string) => isNotEmpty(pass) && passwordRegexVal.test(pass);

/**
 * Valida que una cadena sea un dominio válido y no un email
 * @param domain - String a validar
 * @returns boolean - true si es un dominio válido, false si es email o inválido
 */
export const isValidDomain = (domain: string): boolean => {
  if (!domain || domain.trim() === '') {
    return false;
  }
  
  // Limpiar la URL
  const cleanDomain = domain
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .trim()
    .toLowerCase();
  
  // Verificar que NO sea un email (contiene @)
  if (cleanDomain.includes('@')) {
    return false;
  }
  
  // Regex para validar dominio básico
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Verificar que tenga al menos un punto (dominio.com)
  if (!cleanDomain.includes('.')) {
    return false;
  }
  
  // Verificar que no termine en punto
  if (cleanDomain.endsWith('.')) {
    return false;
  }
  
  // Verificar que no empiece con punto
  if (cleanDomain.startsWith('.')) {
    return false;
  }
  
  // Verificar que no tenga puntos consecutivos
  if (cleanDomain.includes('..')) {
    return false;
  }
  
  // Verificar longitud máxima
  if (cleanDomain.length > 253) {
    return false;
  }
  
  // Verificar formato con regex
  return domainRegex.test(cleanDomain);
};

/**
 * Valida que no sea un email
 * @param value - String a validar
 * @returns boolean - true si NO es un email, false si es un email
 */
export const isNotEmail = (value: string): boolean => {
  if (!value || value.trim() === '') {
    return true;
  }
  
  // Regex básico para detectar emails
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(value.trim());
};
