import { useRef, useState, useEffect } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { APP_EVENT_TYPE } from '@interfaces/panel';

interface PersonInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  gender?: string;
  lastip?: string;
  username?: string;
  country?: string;
  created?: string;
  followers?: string;
  hash?: string;
  id?: string;
  birthdate?: string;
  regdate?: string;
  uid?: string;
  [key: string]: any;
}

export const useSns = () => {
  const { getCompany, getUserdata, logout, company } = useUserData();
  const [fetcher, _, isLoading] = useFetcher();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const [searchData, setSearchDataState] = useState(
    query.get('keyword') || query.get('search') || ''
  );
  const [searchClass, setSearchClass] = useState<string>(query.get('class') || 'email');
  const intelDataRef = useRef<any[]>([]);
  const appEvent = useGlobalFastField('appEvent');
  const { updateState } = useOrderStore();

  // 🧪 FUNCIÓN GLOBAL PARA DEBUGGING
  (window as any).testSnsDetection = (input: string) => {
    // console.log('🧪 Testing SNS detection with:', input);
    const result = detectDataType(input);
    // console.log('📊 Result:', result);
    return result;
  };

  (window as any).testNameValidation = (input: string) => {
    // console.log('🧪 Testing name validation with:', input);
    const result = isValidName(input);
    // console.log('👤 Result:', result);
    return result;
  };

  // 🚫 CONTROL DE TOASTS DUPLICADOS
  const activeToastsRef = useRef<Set<string>>(new Set());

  // Función para mostrar toast sin duplicados
  const showToastOnce = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'warning'
  ) => {
    if (activeToastsRef.current.has(message)) {
      return; // Ya hay un toast activo con este mensaje
    }

    activeToastsRef.current.add(message);

    const toastId = toast[type](message, {
      onClose: () => {
        activeToastsRef.current.delete(message);
      },
      autoClose: 5000,
    });

    return toastId;
  };

  // 🔄 EFECTO PARA ESCUCHAR CAMBIOS EN URL
  useEffect(() => {
    const currentQuery = new URLSearchParams(location.search);
    const newKeyword = currentQuery.get('keyword') || currentQuery.get('search') || '';
    const newClass = currentQuery.get('class') || 'email';

    // Solo actualizar si hay cambios reales en los parámetros
    if (newKeyword !== searchData || newClass !== searchClass) {
      // console.log('🔄 URL cambió, actualizando búsqueda:', { newKeyword, newClass });

      setSearchDataState(newKeyword);
      setSearchClass(newClass);

      // Si hay keyword, ejecutar búsqueda automáticamente
      if (newKeyword.trim() && getUserdata()) {
        const companyID = getCompany();
        if (!companyIdIsNull(companyID)) {
          fetchSearchDirect(companyID, newKeyword, newClass);
        }
      }
    }
  }, [location.search]); // Escuchar cambios en la URL

  // 🤖 FUNCIONES DE DETECCIÓN AUTOMÁTICA
  // Detecta automáticamente: Emails, IPs, Dominios/URLs
  const isValidEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input.trim());
  };

  const isValidIP = (input: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(input.trim())) return false;

    // Verificar que cada octeto esté entre 0-255
    const octets = input.trim().split('.');
    return octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  };

  const extractDomainFromURL = (input: string): string | null => {
    try {
      const trimmed = input.trim();

      // Si ya es un dominio simple (sin protocolo), verificar si es válido
      if (!trimmed.includes('://') && !trimmed.includes('/')) {
        // Remover www. si existe
        const cleanDomain = trimmed.replace(/^www\./, '');
        // Verificar que tenga formato de dominio
        const domainRegex =
          /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (domainRegex.test(cleanDomain) && cleanDomain.includes('.')) {
          return cleanDomain;
        }
        return null;
      }

      // Si es una URL completa, extraer el dominio
      let url = trimmed;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const urlObj = new URL(url);
      let hostname = urlObj.hostname;

      // Remover www. si existe
      hostname = hostname.replace(/^www\./, '');

      return hostname;
    } catch (error) {
      return null;
    }
  };

  // 🧑‍💼 FUNCIÓN PARA DETECTAR NOMBRES CON ESPACIOS
  const isValidName = (input: string): boolean => {
    const name = input.trim();

    // console.log('🔍 isValidName checking:', { name, length: name.length });

    // Debe tener al menos un espacio para ser considerado "full name"
    if (!name.includes(' ')) {
      console.log('❌ No space found');
      return false;
    }

    // Nombre: letras, espacios, puntos, guiones, apostrofes, acentos
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\.\-\']+$/;

    const regexTest = nameRegex.test(name);
    const lengthTest = name.length >= 2 && name.length <= 100;
    const letterTest = /[a-zA-ZÀ-ÿ\u00C0-\u017F]/.test(name);
    const notOnlySpaces = name.trim().length > 0;

    // console.log('🧪 Name validation tests:', {
    //   regexTest,
    //   lengthTest,
    //   letterTest,
    //   notOnlySpaces,
    //   finalResult: regexTest && lengthTest && letterTest && notOnlySpaces,
    // });

    // Verificar que:
    // 1. Contiene solo caracteres válidos para nombres
    // 2. Tiene longitud razonable (2-100 caracteres)
    // 3. Contiene al menos una letra
    // 4. No es solo espacios
    return regexTest && lengthTest && letterTest && notOnlySpaces;
  };

  const detectDataType = (input: string): string => {
    const trimmed = input.trim();

    // console.log('🔍 detectDataType called:', { input, trimmed, currentClass: searchClass });

    if (!input || !trimmed) {
      // console.log('📝 Empty input, returning default email');
      return 'email'; // Default
    }

    // 1. Detectar email
    if (isValidEmail(trimmed)) {
      // console.log('📧 Detected email:', trimmed);
      return 'email';
    }

    // 2. Detectar IP (tanto interna como externa)
    if (isValidIP(trimmed)) {
      // console.log('🌐 Detected IP:', trimmed);
      return 'lastip';
    }

    // 3. Detectar dominio o URL
    const domain = extractDomainFromURL(trimmed);
    if (domain) {
      // console.log('🌍 Detected domain:', domain);
      return '_domain';
    }

    // 4. 🆕 DETECTAR NOMBRE CON ESPACIOS (FULL NAME) - USAR INPUT ORIGINAL CON ESPACIOS
    const nameValid = isValidName(input); // ✅ Usar input original, no trimmed
    // console.log('👤 Name validation:', {
    //   input: input,
    //   isValid: nameValid,
    //   hasSpace: input.includes(' '),
    // });
    if (nameValid) {
      // console.log('✅ Detected full name:', input);
      return 'name';
    }

    // 5. Si no coincide con nada, retornar 'unknown'
    // console.log('❓ No detection match, returning unknown');
    return 'unknown';
  };

  // 🔄 SETTER QUE SOLO DETECTA TIPO, NUNCA INTERFIERE CON INPUT
  const setSearchData = (input: string) => {
    // console.log('🎯 setSearchData called with:', { input, currentClass: searchClass });

    // ✅ SIEMPRE actualizar con el input original sin modificar
    setSearchDataState(input);

    // Solo detectar el tipo para cambiar el dropdown
    const detectedType = detectDataType(input);

    // console.log('📊 Detection result:', {
    //   type: detectedType,
    //   willChange: detectedType !== searchClass,
    // });

    // Solo cambiar el tipo si se detectó algo específico
    if (
      detectedType !== searchClass &&
      (detectedType === 'email' ||
        detectedType === 'lastip' ||
        detectedType === '_domain' ||
        detectedType === 'name' ||
        detectedType === 'unknown')
    ) {
      // console.log('🔄 Changing class from', searchClass, 'to', detectedType);
      setSearchClass(detectedType);
      // console.log('🤖 Detección automática:', {
      //   input: input,
      //   detected: detectedType,
      // });
    } else {
      console.log('⚠️ Not changing class because:', {
        sameType: detectedType === searchClass,
        allowedType: ['email', 'lastip', '_domain', 'name', 'unknown'].includes(detectedType),
        currentType: detectedType,
      });
    }
  };

  const updateUrlParams = (keyword: string, searchClass: string) => {
    const newSearchParams = new URLSearchParams();
    if (keyword.trim()) {
      // ✅ USAR SIEMPRE el keyword original sin procesamiento
      newSearchParams.set('keyword', keyword);
      newSearchParams.set('class', searchClass);
    }

    const newUrl = `${location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  };

  const fetchSearch = (companyID: string) => {
    intelDataRef.current = [];
    // ✅ USAR SIEMPRE el input original del usuario sin procesamiento
    const searchDataParsed = searchData;

    // Actualizar URL con los parámetros de búsqueda
    updateUrlParams(searchDataParsed, searchClass);

    return fetcher('post', {
      body: {
        company_id: companyID,
        keyword: searchDataParsed,
        class: searchClass,
      },
      path: 'sns/search',
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (apiErrorValidation(data)) {
          const customError: any = new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
          customError.code = data?.error_info || 'generic';
          throw customError;
        }
        const arrayOfObjects = !!data?.response?.results
          ? Object.entries(data.response.results).map(([key, value]) => {
              const name = key.split('_').slice(1, -2).join('_');
              return { name, value: value as PersonInfo[] };
            })
          : [];
        intelDataRef.current = arrayOfObjects;
        updateCompany(data.company);
        if (arrayOfObjects.length === 0 || data.response.size == 0) {
          showToastOnce(APP_MESSAGE_TOAST.SEARCH_NOT_FOUND, 'warning');
        }
      })
      .catch(error => {
        switch (error.code) {
          case 'paid_user_leaksearch_maximum_reached':
          case 'leaksearch_maximum_reached':
            limitReached();
            break;
          default:
            showToastOnce(error.message || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR, 'error');
        }
      });
  };

  const fetchSearchDirect = (companyID: string, keyword: string, searchClass: string) => {
    intelDataRef.current = [];
    // ✅ USAR SIEMPRE el keyword original sin procesamiento
    const searchDataParsed = keyword;

    return fetcher('post', {
      body: {
        company_id: companyID,
        keyword: searchDataParsed,
        class: searchClass,
      },
      path: 'sns/search',
    })
      .then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (apiErrorValidation(data)) {
          const customError: any = new Error(data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
          customError.code = data?.error_info || 'generic';
          throw customError;
        }
        const arrayOfObjects = !!data?.response?.results
          ? Object.entries(data.response.results).map(([key, value]) => {
              const name = key.split('_').slice(1, -2).join('_');
              return { name, value: value as PersonInfo[] };
            })
          : [];
        intelDataRef.current = arrayOfObjects;
        updateCompany(data.company);
        if (arrayOfObjects.length === 0 || data.response.size == 0) {
          showToastOnce(APP_MESSAGE_TOAST.SEARCH_NOT_FOUND, 'warning');
        }
      })
      .catch(error => {
        switch (error.code) {
          case 'paid_user_leaksearch_maximum_reached':
          case 'leaksearch_maximum_reached':
            limitReached();
            break;
          default:
            showToastOnce(error.message || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR, 'error');
        }
      });
  };

  const limitReached = () => {
    updateState('open', true);
    updateState('orderStepActive', OrderSection.PAYWALL_MAX_SCAN);
    updateState('resourceType', ResourcesTypes.WEB);
    appEvent.set(APP_EVENT_TYPE.LIMIT_REACHED_SNS);
  };

  const updateCompany = (companyUpdated: any) => {
    if (companyUpdated) company.set(companyUpdated);
  };

  const handleSearch = () => {
    const companyID = getCompany();
    if (companyIdIsNull(companyID)) return;
    return fetchSearch(companyID);
  };

  return {
    searchData,
    searchClass,
    isLoading,
    intelData: intelDataRef.current,
    handleSearch,
    getUserdata,
    setSearchData,
    setSearchClass,
    limitReached,
    company,
    updateCompany,
  } as const;
};
