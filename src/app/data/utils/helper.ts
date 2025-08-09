import DOMPurify from 'isomorphic-dompurify';
import { Sort, type Resouce, type Webresource } from '..';
import type {
  ListenerCallbackType,
  ListenerOptionsType,
  ListenerTarget,
  ListerType,
  UnsubscribeCallback,
} from '@interfaces/helper';
import { unstable_batchedUpdates } from 'react-dom';

/** Gets token in localStorage */
export const getToken = () => {
  const storeJson = localStorage.getItem('globalStore') ?? '';
  const store = storeJson ? JSON.parse(storeJson) : {};
  return store ? store?.session : '';
};
/** Gets company id in localStorage */
export const getFullCompanyFromUser = () => {
  const storeJson = localStorage.getItem('authStore');
  const store = storeJson ? JSON.parse(storeJson) : null;
  const companyID = store ? store.state.userData.company_id : '';
  return {
    id: String(companyID),
    name: 'unknow',
    web: '',
    size: '',
    pais_code: '',
    pais: '',
    pais_provincia: '',
    pais_ciudad: '',
    owner_fname: '',
    owner_lname: '',
    owner_role: '',
    owner_email: '',
    owner_phone: '',
    orders_size: '',
    profile_media: '',
    mercado: '',
    isDisabled: false,
    createdAt: '',
  };
};

/** GET base api url in localStorage */
export const getCustomBaseAPi = () => {
  const storeJson = localStorage.getItem('authStore') ?? '';
  const store = storeJson ? JSON.parse(storeJson) : {};

  return store?.state?.userData?.accessRole === 'admin'
    ? localStorage.getItem('baseApi') || ''
    : '';
};

/** SET baseApi in localStorage */
export const setCustomBaseAPi = (baseApi: string) =>
  window.localStorage.setItem('baseApi', baseApi);

/** delete custom base APi */
export const deleteCustomBaseAPi = () => window.localStorage.removeItem('baseApi');

/** check if it is running on tauri on web  */
export const RUNNING_DESKTOP = (): boolean => {
  return window.__TAURI__ !== undefined;
};

// DATE FORMATTING
export const formatDate = (stringDate: string): string => {
  const parsedDate = new Date(stringDate);

  if (isNaN(parsedDate.getTime())) return stringDate;

  const year = parsedDate.getFullYear();
  const month = extractDateItem(parsedDate.getMonth() + 1);
  const day = extractDateItem(parsedDate.getDate());

  return `${year}-${month}-${day}`;
};

// DATE FORMATTING
export const getCurrentDate = () => {
  const formattedDate = new Date();
  const month = formattedDate.getMonth() + 1;
  const day = formattedDate.getDate();
  const year = formattedDate.getFullYear();

  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
};

export const removeSpecialCharacters = (inputString: string) => {
  const regex = /[.,;:_#?-]/g;
  return inputString.replace(regex, '');
};

/** check if  data is empty/zeros */
export const isEmptyData = (data: any) => {
  if (!data || data.constructor !== Object) return true;

  return Object.values(data).every(item => Boolean(item) == false || item == 0);
};

export const isEmptyShares = (data: any) => {
  if (!data || data.constructor !== Object) return true;

  return Object.values(data).every(item => !Boolean(item));
};

/* Random UUID generator function  */
export const generateID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation using Math.random()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Function generating a random "N" UUID array
 * @returns {Array<string>} - Un array de de ID.
 */
export const generateIDArray = (N: number): string[] => {
  return Array.from({ length: N }, () => {
    return generateID();
  });
};
/**
 * Clear a string of characters: "opiniones", "&nbsp;", "&Acirc;", "reseñas"
 * Used to clean reviews
 */
export const cleanReview = (source: string, ignoreText?: boolean): string => {
  let update = !ignoreText ? source?.replace(/\bopiniones\b/gi, '') : source;
  update = update?.replace?.(/&nbsp;/g, '');
  update = update?.replace?.(/&Acirc;/g, '');
  update = update?.replace?.(/&plusmn;/g, '');
  update = update?.replace?.(/&Atilde;/g, '');
  update = update?.replace?.(/&amp;/g, '');
  update = !ignoreText ? update?.replace?.('reseas', '') : update;

  return update?.trim?.();
};

/**
 * Compare the equality of two objects
 */
export const equalsObj = (first: any, second: any): boolean => {
  const bothAreNull = !first || !second;
  if (bothAreNull) {
    return false;
  }

  const noneIsAnObject = typeof first !== 'object' || typeof second !== 'object';
  if (noneIsAnObject) {
    return false;
  }

  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  const propertyAreNotSame = firstKeys.length !== secondKeys.length;
  if (propertyAreNotSame) return false;

  for (const key of firstKeys) {
    if (!equalsValues(first[key], second[key])) {
      return false;
    }
  }

  return true;
};

/**
 * Compare the equality of two values
 */
export const equalsValues = (first: any, second: any) => {
  return first === second;
};

// DATE FORMATTING
/**
 * Maps a date in epoch format to "yyyy-mm-dd"
 * @param epochDate
 */
export const mapEpochToDate = (epochDate: number | string): string => {
  const date = new Date(Number(epochDate) * 1000);

  const year = date.getFullYear();
  // Add a 0 at the beginning if the month is less than 10
  const month = ('0' + (date.getMonth() + 1)).slice(-2);

  //Add a 0 at the beginning if the day is less than 10
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// DATE FORMATTING
export const formatDateTimeFormat = (originalDate: string): string => {
  const date = new Date(originalDate);

  // Extract date and time components
  const year = date.getFullYear();
  const month = extractDateItem(date.getMonth() + 1);
  const day = extractDateItem(date.getDate());
  const hours = extractDateItem(date.getHours());
  const minutes = extractDateItem(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const formatTimeFormat = (originalDate: string): string => {
  const date = new Date(originalDate);
  const hours = extractDateItem(date.getHours());
  const minutes = extractDateItem(date.getMinutes());
  const seconds = extractDateItem(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
};

export const extractDateItem = (item: any) => String(item).padStart(2, '0');

export const calculateRowSize = (sizeY: number | string) => {
  return typeof sizeY === 'number' ? sizeY + 'dvh' : sizeY;
};

export const calculateRowSizeX = (sizeX: number) => {
  return `${sizeX}%`;
};

export const calculateRowCalcX = (sizeX: number) => {
  return sizeX < 100 ? `calc(100% - ${sizeX}% - 3px)` : '0%';
};

export const cleanHTML = (html: any) => {
  return DOMPurify.sanitize(html, { SAFE_FOR_TEMPLATES: true });
};

export const removePrintAttributesFromBody = () => {
  document.body.removeAttribute('print-report');
  document.title = 'Codefend';
};

export const addPrintAttributesFromBody = (resources: any, resourceDomainText: string) => {
  document.body.setAttribute('print-report', 'true');
  const createdAt = Array.isArray(resources)
    ? resources?.[0]?.createdAt || resources?.[0]?.creacion || ''
    : resources?.createdAt || resources?.creacion || '';

  document.title = `${formatDate(createdAt)}-${removeSpecialCharacters(resourceDomainText)}`;
};

// DATE FORMATTING
export const formatToMonthYear = (dateString: string) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
};

export const formatKeyName = (key: any) => {
  return key
    .split('_')
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const processScans = (scans: any) => {
  const groupedScans = scans.reduce((acc: any, scan: any) => {
    const macAddress = scan.device_mac_address;
    if (!acc[macAddress]) {
      acc[macAddress] = [];
    }
    acc[macAddress].push(scan);
    return acc;
  }, {});

  return Object.values(groupedScans).map((scans: any) => {
    const latestScan = scans.sort((a: any, b: any) => {
      return new Date(b.creacion).getTime() - new Date(a.creacion).getTime();
    })[0];

    latestScan.additionalScans = scans.length - 1;
    return latestScan;
  });
};

export const isScanComplianceValid = (scan: any) => {
  if (!scan.report_data) {
    return false;
  }

  try {
    JSON.parse(scan.report_data);
    return true;
  } catch {
    return false;
  }
};

export const processCompliance = (scan: any) => {
  if (!scan.report_data) {
    return 0;
  }

  try {
    const report = JSON.parse(scan.report_data);

    for (const key in report) {
      if (report.hasOwnProperty(key)) {
        const value = report[key];
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return 0;
          }
        } else if (typeof value === 'boolean' && !value) {
          return 0;
        }
      }
    }

    return 1;
  } catch {
    return 0;
  }
};

export const extractCWEID = (text: string) => {
  if (!text) {
    return 0;
  }
  var pattern = /CWE-(\d+)/;

  var match = text.match(pattern);

  if (match !== null) {
    return match[1];
  } else {
    return 'CWE ID not found.';
  }
};

export const compareVersions = (versionA: any, versionB: any) => {
  if (!versionA) return -1;
  if (!versionB) return 0;

  const partsA = versionA.split('.').map(Number);
  const partsB = versionB.split('.').map(Number);

  const maxLength = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLength; i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;

    if (partA > partB) return 1;
    if (partA < partB) return -1;
  }

  return 0;
};

export const mapScoreToWord = (score: number) => {
  const mapping: { [key: number]: string } = {
    0: '?',
    1: 'intel',
    2: 'low',
    3: 'medium',
    4: 'elevated',
    5: 'critical',
  };

  return mapping[score] || '?';
};

export const highlightToBeforeAfterMatch = (title: string, appName: string) => {
  const lowerCaseTitle = title.toLowerCase();
  const lowerCaseAppName = appName.toLowerCase();

  if (!lowerCaseTitle.includes(lowerCaseAppName)) {
    return {
      before: undefined,
      match: undefined,
      after: undefined,
      title: title,
    };
  }

  const index = lowerCaseTitle.indexOf(lowerCaseAppName);

  const before = title.substring(0, index);
  const match = title.substring(index, index + appName.length);
  const after = title.substring(index + appName.length);

  return { before, match, after, title: undefined };
};

export const flattenRowsData = (rowsData: any[]) => {
  if (!rowsData || rowsData.length === 0) {
    return [];
  }

  const flattened: any[] = [];

  const flatten = (resource: any) => {
    flattened.push(resource);
    if (resource?.childs && Array.isArray(resource.childs)) {
      for (const child of resource.childs) {
        flatten(child);
      }
    }
  };

  for (const resource of rowsData) {
    flatten(resource);
  }

  return flattened;
};

export const compareValues = (a: any, b: any, sortDirection: string): number => {
  if (typeof a === 'object' && typeof b === 'object') {
    a = getValueFromObject(a);
    b = getValueFromObject(b);
  }

  if (sortDirection === Sort.asc) {
    return a < b ? -1 : a > b ? 1 : 0;
  } else {
    return a > b ? -1 : a < b ? 1 : 0;
  }
};

export const getValueFromObject = (value: any): any => {
  return value.props?.riskScore || value.props?.country || value.props?.name || value;
};

export const quickSort = (arr: any[], dataSort: string, sortDirection: string): any[] => {
  if (arr.length <= 1) {
    return arr;
  }

  const stack = [];
  let left = 0;
  let right = arr.length - 1;

  const auxArr = [...arr];

  stack.push(left, right);

  while (stack.length) {
    right = stack.pop()!;
    left = stack.pop()!;

    const pivotIndex = partition(auxArr, left, right, dataSort, sortDirection);

    if (left < pivotIndex - 1) {
      stack.push(left, pivotIndex - 1);
    }

    if (pivotIndex + 1 < right) {
      stack.push(pivotIndex + 1, right);
    }
  }

  // Ordenar recursivamente los childs si existen
  for (const item of auxArr) {
    if (item?.childs && Array.isArray(item.childs) && item.childs.length > 0) {
      item.childs = quickSort(item.childs, dataSort, sortDirection);
    }
  }

  return auxArr;
};

const partition = (
  arr: any[],
  left: number,
  right: number,
  dataSort: string,
  sortDirection: string
): number => {
  const pivotValue = arr[right][dataSort]?.value;
  let pivotIndex = left;

  for (let i = left; i < right; i++) {
    const aValue = arr[i][dataSort]?.value;
    if (compareValues(aValue, pivotValue, sortDirection) < 0) {
      swap(arr, i, pivotIndex);
      pivotIndex++;
    }
  }

  swap(arr, pivotIndex, right);
  return pivotIndex;
};

const swap = (arr: any[], i: number, j: number): void => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

export const formatWalletID = (walletID: string) => {
  if (typeof walletID !== 'string') {
    return '';
  }

  const firstFour = walletID.slice(0, 4);
  const lastThree = walletID.slice(-3);

  return `${firstFour}*****${lastThree}`;
};

export const findWebResourceByID = (
  getResources: Webresource[],
  id: string,
  isChild: boolean
): Resouce | Webresource | null => {
  for (const resource of getResources) {
    if (isChild && resource?.childs) {
      for (const child of resource?.childs) {
        if (child.id === id) {
          return child;
        }
      }
    } else {
      if (resource.id === id) {
        return resource;
      }
    }
  }
  return null;
};

export const formatNumber = (price: string): string => {
  const number = parseFloat(price);
  if (isNaN(number)) {
    throw new Error('Invalid input. Please provide a valid number as string.');
  }
  const parts = number
    .toString()
    .split('')
    .reverse()
    .join('')
    .match(/\d{1,3}/g);

  // Join the sections with commas
  const formattedNumber = parts?.join(',').split('').reverse().join('');

  return formattedNumber || '';
};

export const calculateDaysDifference = (targetDate: string | Date): number => {
  const date = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const currentDate = new Date();
  const differenceInMS = date.getTime() - currentDate.getTime();

  // Convert the difference in milliseconds to days
  const differenceInDays = Math.ceil(differenceInMS / (1000 * 60 * 60 * 24));
  return differenceInDays;
};
export const formatReverseDate = (stringDate: string): string => {
  const date = new Date(stringDate);

  const year = date.getFullYear();
  const month = extractDateItem(date.getMonth() + 1);
  const day = extractDateItem(date.getDate());

  return `${day}-${month}-${year}`;
};
export const getDomainCounts = (members: any) => {
  const domainCounts = members.reduce((acc: any, member: any) => {
    const [, domain] = member.member_email.split('@');
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(domainCounts).map(([domain, quantity]) => ({
    domain,
    quantity,
  }));
};

export const getMappedDomainCount = (members: any[]) => {
  return members.map((member: any) => {
    return {
      domain: member.resource_domain,
      quantity: member.count,
    };
  });
};

export function addEventListener<K extends keyof WindowEventMap>(
  target: Window & typeof globalThis,
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: ListenerOptionsType
): UnsubscribeCallback;
export function addEventListener(
  target: Window & typeof globalThis,
  type: string,
  listener: (this: Window, ev: Event) => any,
  options?: ListenerOptionsType
): UnsubscribeCallback;
// Document
export function addEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: ListenerOptionsType
): UnsubscribeCallback;
export function addEventListener(
  target: Document,
  type: string,
  listener: (this: Document, ev: Event) => any,
  options?: ListenerOptionsType
): UnsubscribeCallback;
export function addEventListener<K extends keyof HTMLElementEventMap>(
  target: Document | (Window & typeof globalThis) | HTMLElement | undefined | null | false,
  type: K,
  listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): UnsubscribeCallback;
export function addEventListener(
  target: ListenerTarget,
  type: ListerType,
  listener: ListenerCallbackType,
  options?: ListenerOptionsType
): UnsubscribeCallback {
  if (!target) {
    return () => {};
  }
  target?.addEventListener?.(type, listener, options);
  return () => {
    target?.removeEventListener?.(type, listener, options);
  };
}

export const withBatchedUpdates = <TFunction extends ((event: any) => void) | (() => void)>(
  func: Parameters<TFunction>['length'] extends 0 | 1 ? TFunction : never
) =>
  (event => {
    unstable_batchedUpdates(func as TFunction, event);
  }) as TFunction;

export const defaultIsShallowComparatorFallback = (a: any, b: any): boolean => {
  // consider two empty arrays equal
  if (Array?.isArray?.(a) && Array?.isArray?.(b) && a?.length === 0 && b?.length === 0) {
    return true;
  }
  return a === b;
};

export const isShallowEqual = <T extends Record<string, any>, K extends readonly unknown[]>(
  objA: T,
  objB: T,
  comparators?:
    | { [key in keyof T]?: (a: T[key], b: T[key]) => boolean }
    | (keyof T extends K[number]
        ? K extends readonly (keyof T)[]
          ? K
          : {
              _error: 'keys are either missing or include keys not in compared obj';
            }
        : {
            _error: 'keys are either missing or include keys not in compared obj';
          }),
  debug = false
) => {
  const aKeys = Object?.keys?.(objA);
  const bKeys = Object?.keys?.(objB);
  if (aKeys?.length !== bKeys?.length) {
    if (debug) {
      console.warn(
        `%cisShallowEqual: objects don't have same properties ->`,
        'color: #8B4000',
        objA,
        objB
      );
    }
    return false;
  }

  if (comparators && Array?.isArray?.(comparators)) {
    for (const key of comparators) {
      const ret =
        objA?.[key] === objB?.[key] || defaultIsShallowComparatorFallback(objA?.[key], objB?.[key]);
      if (!ret) {
        if (debug) {
          console.warn(
            `%cisShallowEqual: ${key} not equal ->`,
            'color: #8B4000',
            objA?.[key],
            objB?.[key]
          );
        }
        return false;
      }
    }
    return true;
  }

  return aKeys?.every(key => {
    const comparator = (comparators as { [key in keyof T]?: (a: T[key], b: T[key]) => boolean })?.[
      key as keyof T
    ];
    const ret = comparator
      ? comparator(objA[key], objB[key])
      : objA[key] === objB[key] || defaultIsShallowComparatorFallback(objA[key], objB[key]);

    if (!ret && debug) {
      console.warn(`%cisShallowEqual: ${key} not equal ->`, 'color: #8B4000', objA[key], objB[key]);
    }
    return ret;
  });
};

export const debounce = <T extends any[]>(fn: (...args: T) => void, timeout: number) => {
  let handle = 0;
  let lastArgs: T | null = null;
  const ret = (...args: T) => {
    lastArgs = args;
    clearTimeout(handle);
    handle = window.setTimeout(() => {
      lastArgs = null;
      fn(...args);
    }, timeout);
  };
  ret.flush = () => {
    clearTimeout(handle);
    if (lastArgs) {
      const _lastArgs = lastArgs;
      lastArgs = null;
      fn(..._lastArgs);
    }
  };
  ret.cancel = () => {
    lastArgs = null;
    clearTimeout(handle);
  };
  return ret;
};

// DATE FORMATTING
/**
 * Returns a human-friendly relative time string in English.
 * @param dateStr "YYYY-MM-DD HH:mm:ss"
 * @param locale any BCP-47 locale (default "en")
 */
export function naturalTime(dateStr: string, locale: string = 'en'): string {
  const date = new Date(dateStr.replace(' ', 'T')); // Asegura compatibilidad con el formato "YYYY-MM-DD HH:mm:ss"
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  const sec = Math.round(diffMs / 1000);
  // const days = Math.floor(sec / 86400);
  // const months = monthDiff(date, now);
  // const years = yearDiff(date, now);

  if (diffMs < 0) {
    return '';
  }

  if (diffSec < 59) {
    return 'now';
  }

  if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  if (diffDays === 1) {
    return 'yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (diffWeeks === 1) {
    return 'last week';
  }

  if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`;
  }

  const units = [
    { limit: 60, divisor: 1, unit: 'second' },
    { limit: 3600, divisor: 60, unit: 'minute' },
    { limit: 86400, divisor: 3600, unit: 'hour' },
    { limit: 604800, divisor: 86400, unit: 'day' },
    { limit: 2419200, divisor: 604800, unit: 'week' },
  ];

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns a human-friendly relative time string in Spanish.
 * @param dateStr "YYYY-MM-DD HH:mm:ss" or similar date string
 */
export function naturalTimeSpanish(dateStr: string): string {
  if (!dateStr) return '';
  
  const date = new Date(dateStr.replace(' ', 'T')); // Asegura compatibilidad con el formato "YYYY-MM-DD HH:mm:ss"
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMs < 0) {
    return '';
  }

  if (diffSec < 59) {
    return 'ahora';
  }

  if (diffMin < 60) {
    return `${diffMin} minuto${diffMin === 1 ? '' : 's'} atrás`;
  }

  if (diffHours < 24) {
    return `${diffHours} hora${diffHours === 1 ? '' : 's'} atrás`;
  }

  if (diffDays === 1) {
    return '1 día atrás';
  }

  if (diffDays < 7) {
    return `${diffDays} día${diffDays === 1 ? '' : 's'} atrás`;
  }

  if (diffWeeks === 1) {
    return 'semana pasada';
  }

  if (diffWeeks === 2) {
    return '2 semanas atrás';
  }

  if (diffWeeks === 3) {
    return '3 semanas atrás';
  }

  if (diffWeeks < 8) {
    return `${diffWeeks} semanas atrás`;
  }

  // Para fechas muy antiguas, usar formato de fecha
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
