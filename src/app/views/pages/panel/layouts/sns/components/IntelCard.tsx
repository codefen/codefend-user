import type { IntelData } from '@interfaces/snsTypes';
import { type FC, useState, useRef, useEffect, type ReactNode, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull, apiErrorValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import ModalWrapper from '@/app/views/components/modals/modalwrapper/ModalWrapper';
import * as d3 from 'd3';
import type { GeoPermissibleObjects } from 'd3-geo';

interface IntelCardProps {
  intel: IntelData;
  onOpenLeakedModal: (leaked: any, type: 'crack' | 'geo') => void;
  refetch: () => void;
}

interface CrackResult {
  hash: string;
  password: string;
  salt: string;
}

interface GeoResult {
  ip: string;
  asname: string;
  org: string;
  country: string;
  city: string;
  region: string;
  zip: string;
  lat: string;
  lon: string;
  mobile: string;
  proxy: string;
}

interface CrackState {
  [key: string]: {
    isLoading: boolean;
    results: CrackResult[] | null;
    error: string | null;
  };
}

interface GeoState {
  [key: string]: {
    isLoading: boolean;
    results: GeoResult | null;
    error: string | null;
  };
}

// Componente de mapa para SNS
const SnsGeoMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [width, setWidth] = useState(0);
  const height = 220;

  useEffect(() => {
    // Cargar geojson
    fetch('/data/world.geojson')
      .then(res => res.json())
      .then(setGeoData);
  }, []);

  useEffect(() => {
    if (!geoData || !ref.current) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const container = ref.current.parentElement;
    const w = container ? container.offsetWidth : 360;
    setWidth(w);
    svg.attr('width', w).attr('height', height);
    // Calcular el centro y extent para hacer zoom
    const zoomFactor = 0.1; // 0.18 = mucho zoom, 0.5 = menos zoom
    const [cx, cy] = [lon, lat];
    // Definir un bounding box pequeño alrededor del punto
    const minLon = cx - 20 * zoomFactor;
    const maxLon = cx + 20 * zoomFactor;
    const minLat = cy - 10 * zoomFactor;
    const maxLat = cy + 10 * zoomFactor;
    const bbox = [
      [minLon, minLat],
      [maxLon, maxLat],
    ];
    const projection = d3.geoNaturalEarth1().fitExtent(
      [
        [0, 0],
        [w, height],
      ],
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [minLon, minLat],
              [maxLon, minLat],
              [maxLon, maxLat],
              [minLon, maxLat],
              [minLon, minLat],
            ],
          ],
        },
        properties: {},
      }
    );
    const path = d3.geoPath().projection(projection);
    // Mapa base (sin contorno exterior)
    svg
      .append('g')
      .selectAll('path')
      .data(
        geoData.features.filter((f: any) => f.geometry.type !== 'Sphere') as GeoPermissibleObjects[]
      )
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', '#f5f5f5')
      .attr('stroke', '#bbb')
      .attr('stroke-width', 0.5);
    // Proyectar punto
    const projected = projection([lon, lat]);
    if (projected) {
      const [x, y] = projected;
      // Líneas
      svg
        .append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#111')
        .attr('stroke-width', 1.2)
        .attr('stroke-dasharray', '4,2');
      svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', w)
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', '#111')
        .attr('stroke-width', 1.2)
        .attr('stroke-dasharray', '4,2');
      // Punto
      svg
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 6)
        .attr('fill', '#ff3939')
        .attr('stroke', '#111')
        .attr('stroke-width', 2);
    }
  }, [geoData, lat, lon]);

  return <svg ref={ref} style={{ width: '100%', height }} />;
};

// Función para obtener el emoji de bandera a partir del nombre del país
const countryNameToFlagEmoji = (country: string) => {
  if (!country) return '';
  const nameToCode: Record<string, string> = {
    Italy: 'IT',
    Argentina: 'AR',
    France: 'FR',
    Germany: 'DE',
    Spain: 'ES',
    'United Kingdom': 'GB',
    USA: 'US',
    'United States': 'US',
    Canada: 'CA',
    Russia: 'RU',
    China: 'CN',
    India: 'IN',
    Japan: 'JP',
    Brazil: 'BR',
    Australia: 'AU',
    Mexico: 'MX',
    Belgium: 'BE',
    Switzerland: 'CH',
    Austria: 'AT',
    Portugal: 'PT',
    Poland: 'PL',
    'Czech Republic': 'CZ',
    Hungary: 'HU',
    Romania: 'RO',
    Bulgaria: 'BG',
    Croatia: 'HR',
    Slovenia: 'SI',
    Slovakia: 'SK',
    Estonia: 'EE',
    Latvia: 'LV',
    Lithuania: 'LT',
    Finland: 'FI',
    Denmark: 'DK',
    Iceland: 'IS',
    Ireland: 'IE',
    Greece: 'GR',
    Turkey: 'TR',
    Israel: 'IL',
    Singapore: 'SG',
    'South Korea': 'KR',
    Thailand: 'TH',
    Malaysia: 'MY',
    Indonesia: 'ID',
    Philippines: 'PH',
    Vietnam: 'VN',
    'New Zealand': 'NZ',
    Chile: 'CL',
    'South Africa': 'ZA',
  };
  const code = nameToCode[country.trim()] || '';
  if (!code) return '';
  // Convierte código de país a emoji de bandera
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

// Función para obtener el código de país (ISO 3166-1 alpha-2, lowercase) a partir del nombre
const countryNameToCode = (country: string) => {
  if (!country) return '';
  const nameToCode: Record<string, string> = {
    Italy: 'it',
    Argentina: 'ar',
    France: 'fr',
    Germany: 'de',
    Spain: 'es',
    'United Kingdom': 'gb',
    USA: 'us',
    'United States': 'us',
    Canada: 'ca',
    Russia: 'ru',
    China: 'cn',
    India: 'in',
    Japan: 'jp',
    Brazil: 'br',
    Australia: 'au',
    Mexico: 'mx',
    Belgium: 'be',
    Switzerland: 'ch',
    Austria: 'at',
    Portugal: 'pt',
    Poland: 'pl',
    'Czech Republic': 'cz',
    Hungary: 'hu',
    Romania: 'ro',
    Bulgaria: 'bg',
    Croatia: 'hr',
    Slovenia: 'si',
    Slovakia: 'sk',
    Estonia: 'ee',
    Latvia: 'lv',
    Lithuania: 'lt',
    Finland: 'fi',
    Denmark: 'dk',
    Iceland: 'is',
    Ireland: 'ie',
    Greece: 'gr',
    Turkey: 'tr',
    Israel: 'il',
    Singapore: 'sg',
    'South Korea': 'kr',
    Thailand: 'th',
    Malaysia: 'my',
    Indonesia: 'id',
    Philippines: 'ph',
    Vietnam: 'vn',
    'New Zealand': 'nz',
    Chile: 'cl',
    'South Africa': 'za',
  };
  return nameToCode[country.trim()] || '';
};

export const IntelCard: FC<IntelCardProps> = ({ intel, onOpenLeakedModal, refetch }) => {
  const [crackStates, setCrackStates] = useState<CrackState>({});
  const [geoStates, setGeoStates] = useState<GeoState>({});
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const navigate = useNavigate();
  const [externalModal, setExternalModal] = useState<{ open: boolean; url: string }>({
    open: false,
    url: '',
  });

  // 🚫 CONTROL DE TOASTS DUPLICADOS
  const activeToastsRef = useRef<Set<string>>(new Set());

  // Función para mostrar toast sin duplicados
  const showToastOnce = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'error'
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

  const formatName = (name: string) => {
    // Detectar si es un string de breach (formato: NUMEROS_DOMINIO_SIZE_CATEGORY_FECHA)
    const breachPattern = /^\d+_(.+?)_(\d+[KMB])_([A-Z_]+)_(\d+)$/;
    const match = name.match(breachPattern);

    if (match) {
      const [, domainPart, size, category, date] = match;

      // Formatear el dominio (convertir DEEZER_COM a Deezer.com)
      const domain = domainPart
        .toLowerCase()
        .replace(/_/g, '.')
        .replace(/^([a-z])/, char => char.toUpperCase());

      // Formatear la fecha
      let formattedDate = '';
      if (date.length === 6) {
        // Formato MMYYYY (ej: 092019 -> 09/2019)
        const month = date.substring(0, 2);
        const year = date.substring(2);
        formattedDate = `${month}/${year}`;
      } else if (date.length === 4) {
        // Solo año (ej: 2019)
        formattedDate = date;
      } else {
        formattedDate = date;
      }

      // Retornar JSX con 3 divisiones internas
      return (
        <div className="breach-title-container">
          <div className="breach-icon">🔥 {domain} breach</div>
          <div className="breach-size">📊 {size} exposed records</div>
          <div className="breach-date">📅 {formattedDate}</div>
        </div>
      );
    }

    // Si no es un breach, usar el formato original
    return (
      name
        .replace(/_\d+[MK]$/, '')
        .charAt(0)
        .toUpperCase() +
      name
        .replace(/_\d+[MK]$/, '')
        .slice(1)
        .toLowerCase()
    );
  };

  // Función para detectar si un valor es una IP válida
  const isValidIP = (value: string): boolean => {
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(value.trim());
  };

  // Función para detectar si un valor es un hash válido
  const isValidHash = (value: string): boolean => {
    const hashValue = value.trim();
    // Detectar hashes comunes: MD5 (32 chars), SHA1 (40 chars), SHA256 (64 chars), etc.
    const hashRegex = /^[a-fA-F0-9]{32,}$/;
    return hashRegex.test(hashValue) && hashValue.length >= 32;
  };

  // Función para detectar si un valor es un email válido
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  // Función para detectar si un valor es un username válido
  const isValidUsername = (value: string): boolean => {
    const username = value.trim();
    // Username: alfanumérico, puntos, guiones bajos, sin espacios, longitud razonable
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    return usernameRegex.test(username) && username.length >= 3 && username.length <= 30;
  };

  // Función para detectar si un valor es un dominio válido
  const isValidDomain = (value: string): boolean => {
    const domain = value.trim();
    // Dominio: formato válido, debe contener al menos un punto
    const domainRegex =
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain) && domain.includes('.') && domain.length >= 4;
  };

  // Función para detectar si un valor es un nombre válido
  const isValidName = (value: string): boolean => {
    const name = value.trim();
    // Nombre: letras, espacios, puntos, guiones, apostrofes, longitud razonable
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\.\-\']+$/;
    return (
      nameRegex.test(name) &&
      name.length >= 2 &&
      name.length <= 100 &&
      /[a-zA-ZÀ-ÿ\u00C0-\u017F]/.test(name)
    );
  };

  // Función para detectar si un valor es una URL válida
  const isValidURL = (value: string): boolean => {
    const url = value.trim();
    // URL: debe comenzar con http:// o https://
    const urlRegex = /^https?:\/\/.+/;
    return urlRegex.test(url);
  };

  // Función para manejar clic en IP
  const handleIPClick = (ip: string) => {
    const cleanIP = ip.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanIP)}&class=lastip`);
    setTimeout(() => refetch(), 500);
  };

  // Función para manejar clic en Hash
  const handleHashClick = (hash: string) => {
    const cleanHash = hash.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanHash)}&class=hash`);
    setTimeout(() => refetch(), 500);
  };

  // Función para manejar clic en Email
  const handleEmailClick = (email: string) => {
    const cleanEmail = email.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanEmail)}&class=email`);
    setTimeout(() => refetch(), 500);
  };

  // Función para manejar clic en Username
  const handleUsernameClick = (username: string) => {
    const cleanUsername = username.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanUsername)}&class=username`);
    setTimeout(() => refetch(), 500);
  };

  // Función para manejar clic en Domain
  const handleDomainClick = (domain: string) => {
    const cleanDomain = domain.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanDomain)}&class=_domain`);
    setTimeout(() => refetch(), 500);
  };

  // Función para manejar clic en Name
  const handleNameClick = (name: string) => {
    const cleanName = name.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanName)}&class=name`);
    setTimeout(() => refetch(), 500);
  };

  // Función para manejar clic en URL
  const handleURLClick = (url: string) => {
    const cleanURL = url.trim();
    const confirmed = window.confirm(
      `You are about to leave to "${cleanURL}"\n\nClick OK to continue or Cancel to stay.`
    );

    if (confirmed) {
      window.open(cleanURL, '_blank', 'noopener,noreferrer');
    }
  };

  // Función para manejar clic en Password
  const handlePasswordClick = (password: string) => {
    const cleanPassword = password.trim();
    navigate(`/sns?keyword=${encodeURIComponent(cleanPassword)}&class=password`);
    setTimeout(() => refetch(), 500);
  };

  // Función para renderizar el valor con detección de IP, Hash, Email, Username, Domain, Name y URL
  const isFieldClickable = (key: string, value: string): boolean => {
    return (
      ((key.toLowerCase().includes('ip') || key.toLowerCase() === 'lastip') && isValidIP(value)) ||
      (key.toLowerCase().includes('hash') && isValidHash(value)) ||
      (key.toLowerCase().includes('email') && isValidEmail(value)) ||
      (key.toLowerCase().includes('username') && isValidUsername(value)) ||
      ((key.toLowerCase().includes('domain') ||
        key.toLowerCase().includes('host') ||
        key.toLowerCase().includes('website') ||
        key.toLowerCase().includes('url')) &&
        isValidDomain(value)) ||
      ((key.toLowerCase().includes('name') ||
        key.toLowerCase().includes('firstname') ||
        key.toLowerCase().includes('lastname') ||
        key.toLowerCase().includes('fullname')) &&
        isValidName(value)) ||
      ((key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('link') ||
        key.toLowerCase().includes('website')) &&
        isValidURL(value))
    );
  };

  const getFieldClickHandler = (key: string, value: string) => {
    if ((key.toLowerCase().includes('ip') || key.toLowerCase() === 'lastip') && isValidIP(value)) {
      return { onClick: () => handleIPClick(value), title: `Click to search IP: ${value}` };
    }
    if (key.toLowerCase().includes('hash') && isValidHash(value)) {
      return { onClick: () => handleHashClick(value), title: `Click to search hash: ${value}` };
    }
    if (key.toLowerCase().includes('email') && isValidEmail(value)) {
      return { onClick: () => handleEmailClick(value), title: `Click to search email: ${value}` };
    }
    if (key.toLowerCase().includes('username') && isValidUsername(value)) {
      return {
        onClick: () => handleUsernameClick(value),
        title: `Click to search username: ${value}`,
      };
    }
    if (
      (key.toLowerCase().includes('domain') ||
        key.toLowerCase().includes('host') ||
        key.toLowerCase().includes('website') ||
        key.toLowerCase().includes('url')) &&
      isValidDomain(value)
    ) {
      return { onClick: () => handleDomainClick(value), title: `Click to search domain: ${value}` };
    }
    if (
      (key.toLowerCase().includes('name') ||
        key.toLowerCase().includes('firstname') ||
        key.toLowerCase().includes('lastname') ||
        key.toLowerCase().includes('fullname')) &&
      isValidName(value)
    ) {
      return { onClick: () => handleNameClick(value), title: `Click to search name: ${value}` };
    }
    if (
      (key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('link') ||
        key.toLowerCase().includes('website')) &&
      isValidURL(value)
    ) {
      return { onClick: () => handleURLClick(value), title: `Click to open URL: ${value}` };
    }
    return null;
  };

  const renderIntelValue = (key: string, value: string) => {
    // Si es un campo de IP (lastip, regip, etc.) y el valor es una IP válida
    if ((key.toLowerCase().includes('ip') || key.toLowerCase() === 'lastip') && isValidIP(value)) {
      return (
        <span className="intel-value intel-ip-clickable" style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de hash y el valor es un hash válido
    if (key.toLowerCase().includes('hash') && isValidHash(value)) {
      return (
        <span
          className="intel-value intel-hash-clickable hash-value"
          style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de email y el valor es un email válido
    if (key.toLowerCase().includes('email') && isValidEmail(value)) {
      return (
        <span className="intel-value intel-email-clickable" style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de username y el valor es un username válido
    if (key.toLowerCase().includes('username') && isValidUsername(value)) {
      return (
        <span className="intel-value intel-username-clickable" style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de dominio y el valor es un dominio válido
    if (
      (key.toLowerCase().includes('domain') ||
        key.toLowerCase().includes('host') ||
        key.toLowerCase().includes('website') ||
        key.toLowerCase().includes('url')) &&
      isValidDomain(value)
    ) {
      return (
        <span className="intel-value intel-domain-clickable" style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de nombre y el valor es un nombre válido
    if (
      (key.toLowerCase().includes('name') ||
        key.toLowerCase().includes('firstname') ||
        key.toLowerCase().includes('lastname') ||
        key.toLowerCase().includes('fullname')) &&
      isValidName(value)
    ) {
      return (
        <span className="intel-value intel-name-clickable" style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de URL y el valor es una URL válida
    if (
      (key.toLowerCase().includes('url') ||
        key.toLowerCase().includes('link') ||
        key.toLowerCase().includes('website')) &&
      isValidURL(value)
    ) {
      return (
        <span className="intel-value intel-url-clickable" style={{ fontFamily: 'Satoshi' }}>
          {value}
        </span>
      );
    }

    // Si es un campo de país y el valor es un nombre de país válido, renderiza el emoji de bandera
    if (key.toLowerCase() === 'country' && isValidName(value)) {
      return (
        <span>
          {value}
          {countryNameToFlagEmoji(value) && (
            <span style={{ marginLeft: 6 }}>{countryNameToFlagEmoji(value)}</span>
          )}
        </span>
      );
    }

    // En renderIntelValue, para la key 'country', renderiza la bandera con la clase flag flag-xx (igual que admin/company)
    if (key.toLowerCase() === 'country') {
      const code = countryNameToCode(value);
      return (
        <span>
          {value}
          {code ? (
            <span
              className={`flag flag-${code}`}
              style={{ marginLeft: 6, verticalAlign: 'middle' }}
              title={value}></span>
          ) : (
            <span style={{ marginLeft: 6, verticalAlign: 'middle' }} title={value}>
              🌍
            </span>
          )}
        </span>
      );
    }

    // Valor normal
    const isLongValue = value.length > 50;
    const isHashLikeValue = /^[a-fA-F0-9]{32,}$/.test(value.trim());

    return (
      <span
        className={`intel-value ${isHashLikeValue ? 'hash-value' : ''}`}
        style={{
          fontFamily: 'Satoshi',
          ...(isLongValue &&
            !isHashLikeValue && {
              wordBreak: 'break-all',
              overflowWrap: 'anywhere',
              maxWidth: '300px',
              display: 'inline-block',
            }),
        }}>
        {value}
      </span>
    );
  };

  const handleCrackPassword = async (subIntel: any, subIndex: number) => {
    const stateKey = `${subIndex}-${subIntel.hash}`;

    // Actualizar estado a loading
    setCrackStates(prev => ({
      ...prev,
      [stateKey]: {
        isLoading: true,
        results: null,
        error: null,
      },
    }));

    try {
      const companyID = getCompany();
      if (companyIdIsNull(companyID)) {
        throw new Error('Company ID is null');
      }

      const response = await fetcher('post', {
        body: {
          class: 'hash',
          keyword: subIntel.hash,
          company_id: companyID,
        },
        path: 'sns/hash',
        requireSession: true,
      });

      if (apiErrorValidation(response.data)) {
        throw new Error((response.data as any)?.info || 'Error al procesar la solicitud');
      }

      const results = (response.data as any)?.response?.results;
      const hasResults = results && Object.keys(results).length > 0;

      if (hasResults) {
        // Procesar resultados
        const processedResults: CrackResult[] = [];
        Object.entries(results).forEach(([key, value]: [string, any]) => {
          if (Array.isArray(value)) {
            value.forEach((item: any) => {
              processedResults.push({
                hash: item.hash || '',
                password: item.password || '',
                salt: item.salt || '',
              });
            });
          }
        });

        setCrackStates(prev => ({
          ...prev,
          [stateKey]: {
            isLoading: false,
            results: processedResults,
            error: null,
          },
        }));
      } else {
        // No hay resultados
        setCrackStates(prev => ({
          ...prev,
          [stateKey]: {
            isLoading: false,
            results: null,
            error: null,
          },
        }));
      }
    } catch (error: any) {
      console.error('Error cracking password:', error);
      setCrackStates(prev => ({
        ...prev,
        [stateKey]: {
          isLoading: false,
          results: null,
          error: error.message || 'Error desconocido',
        },
      }));
      showToastOnce(error.message || 'Error al procesar la solicitud', 'error');
    }
  };

  const handleGeolocateIP = async (
    subIntel: any,
    subIndex: number,
    ipType: 'regip' | 'lastip' = 'regip'
  ) => {
    const ipValue = ipType === 'regip' ? subIntel.regip : subIntel.lastip;
    const stateKey = `${subIndex}-${ipType}-${ipValue}`;

    // Actualizar estado a loading
    setGeoStates(prev => ({
      ...prev,
      [stateKey]: {
        isLoading: true,
        results: null,
        error: null,
      },
    }));

    try {
      const companyID = getCompany();
      if (companyIdIsNull(companyID)) {
        throw new Error('Company ID is null');
      }

      const response = await fetcher('post', {
        body: {
          class: 'whois',
          keyword: ipValue,
          company_id: companyID,
        },
        path: 'sns/whois',
        requireSession: true,
      });

      if (apiErrorValidation(response.data)) {
        throw new Error((response.data as any)?.info || 'Error al procesar la solicitud');
      }

      const results = (response.data as any)?.response?.results;
      const hasResults = results && Object.keys(results).length > 0;

      if (hasResults) {
        // Procesar resultados - tomar el primer resultado
        const firstKey = Object.keys(results)[0];
        const processedResults: GeoResult = {
          ip: ipValue,
          asname: results[firstKey]?.asname || '',
          org: results[firstKey]?.org || '',
          country: results[firstKey]?.country || '',
          city: results[firstKey]?.city || '',
          region: results[firstKey]?.region || '',
          zip: results[firstKey]?.zip || '',
          lat: results[firstKey]?.lat || '',
          lon: results[firstKey]?.lon || '',
          mobile: results[firstKey]?.mobile || '',
          proxy: results[firstKey]?.proxy || '',
        };

        setGeoStates(prev => ({
          ...prev,
          [stateKey]: {
            isLoading: false,
            results: processedResults,
            error: null,
          },
        }));
      } else {
        // No hay resultados
        setGeoStates(prev => ({
          ...prev,
          [stateKey]: {
            isLoading: false,
            results: null,
            error: null,
          },
        }));
      }
    } catch (error: any) {
      console.error('Error geolocating IP:', error);
      setGeoStates(prev => ({
        ...prev,
        [stateKey]: {
          isLoading: false,
          results: null,
          error: error.message || 'Error desconocido',
        },
      }));
      showToastOnce(error.message || 'Error al procesar la solicitud', 'error');
    }
  };

  const renderCrackResults = (subIntel: any, subIndex: number): ReactNode => {
    const stateKey = `${subIndex}-${subIntel.hash}`;
    const state = crackStates[stateKey];

    if (!state) return null;

    if (state.isLoading) {
      return (
        <div className="intel-row intel-crack-loading">
          <span className="intel-label" style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
            Status:{' '}
          </span>
          <span className="intel-value" style={{ fontFamily: 'Satoshi', color: '#666' }}>
            🔄 Cracking password...
          </span>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="intel-row intel-crack-failed">
          <span className="intel-label" style={{ fontWeight: 600 }}>
            Password crack:
          </span>{' '}
          failure - no luck, couldn't crack this one! ❌
        </div>
      );
    }

    if (state.results && state.results.length > 0) {
      // Filtrar duplicados solo si hay dos passwords y son iguales
      let passwords = state.results.map((result: any) => result.password);
      if (passwords.length === 2 && passwords[0] === passwords[1]) {
        passwords = [passwords[0]];
      }
      return (
        <>
          {passwords.map((password: string, idx: number) => (
            <div
              key={idx}
              className="intel-row intel-crack-success clickable-row"
              onClick={() => handlePasswordClick(password)}
              title={`Click to search password: ${password}`}
              style={{ cursor: 'pointer' }}>
              <span
                className="intel-label"
                style={{ color: '#28a745', fontWeight: 600, marginRight: 6 }}>
                ✅
              </span>{' '}
              <span style={{ color: '#28a745', fontWeight: 600, marginRight: 6 }}>🔓</span>{' '}
              <span style={{ fontWeight: 600 }}>Password has been cracked:</span>{' '}
              <span
                className="intel-value intel-password-clickable"
                style={{ fontFamily: 'Satoshi' }}>
                {password}
              </span>
              <span className="intel-row-arrow">→</span>
            </div>
          ))}
        </>
      );
    }

    // Mostrar mensaje de failure si no hay resultados, no está loading ni hay error
    if (!state.isLoading && !state.error && (!state.results || state.results.length === 0)) {
      return (
        <div className="intel-row intel-crack-failed">
          <span className="intel-label" style={{ fontWeight: 600 }}>
            Password crack:
          </span>{' '}
          failure - no luck, couldn't crack this one! ❌
        </div>
      );
    }

    // No results
    return null;
  };

  const renderGeoResults = (subIntel: any, subIndex: number) => {
    // Renderizar resultados para regip
    const regipResults = subIntel.regip ? renderGeoResultsForIP(subIntel, subIndex, 'regip') : null;
    // Renderizar resultados para lastip
    const lastipResults = subIntel.lastip
      ? renderGeoResultsForIP(subIntel, subIndex, 'lastip')
      : null;

    return (
      <>
        {regipResults}
        {lastipResults}
      </>
    );
  };

  const renderGeoResultsForIP = (subIntel: any, subIndex: number, ipType: 'regip' | 'lastip') => {
    const ipValue = ipType === 'regip' ? subIntel.regip : subIntel.lastip;
    const stateKey = `${subIndex}-${ipType}-${ipValue}`;
    const state = geoStates[stateKey];

    // Solo mostrar el div de status si el usuario apretó geolocate (es decir, si existe state)
    if (!state) return null;

    let statusText = '';
    if (state.isLoading) {
      statusText = 'Status: 🌍 Geolocating IP...';
    } else {
      statusText = `🌍 Geolocation data for IP ${ipValue}`;
    }

    return (
      <>
        <div
          className="intel-row intel-geo-loading"
          style={{ background: 'rgba(0,123,255,0.07)', color: '#222', border: 'none' }}>
          <span className="intel-label" style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
            {statusText}
          </span>
        </div>
        {/* Mostrar resultados debajo si existen */}
        {state.results && (
          <>
            {state.results.asname && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Company:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.asname}
                </span>
              </div>
            )}
            {state.results.org && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  ORG:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.org}
                </span>
              </div>
            )}
            {state.results.country && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Country:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.country}
                  {(() => {
                    const code = countryNameToCode(state.results.country);
                    return code ? (
                      <span
                        className={`flag flag-${code}`}
                        style={{ marginLeft: 6, verticalAlign: 'middle' }}
                        title={state.results.country}></span>
                    ) : (
                      <span
                        style={{ marginLeft: 6, verticalAlign: 'middle' }}
                        title={state.results.country}>
                        🌍
                      </span>
                    );
                  })()}
                </span>
              </div>
            )}
            {state.results.city && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  City:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.city}
                </span>
              </div>
            )}
            {state.results.region && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Region:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.region}
                </span>
              </div>
            )}
            {state.results.zip && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Zip:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.zip}
                </span>
              </div>
            )}
            {state.results.lat && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Latitude:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.lat}
                </span>
              </div>
            )}
            {state.results.lon && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Longitude:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.lon}
                </span>
              </div>
            )}
            {state.results.mobile && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Mobile:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.mobile}
                </span>
              </div>
            )}
            {state.results.proxy && (
              <div className="intel-row">
                <span
                  className="intel-label"
                  style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                  Proxy:{' '}
                </span>
                <span className="intel-value" style={{ fontFamily: 'Satoshi' }}>
                  {state.results.proxy}
                </span>
              </div>
            )}
          </>
        )}
        {state && state.results && state.results.lat && state.results.lon && (
          <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto 12px auto' }}>
            <SnsGeoMap lat={parseFloat(state.results.lat)} lon={parseFloat(state.results.lon)} />
          </div>
        )}
      </>
    );
  };

  // Handler para links externos
  const handleExternalLink = (url: string) => {
    setExternalModal({ open: true, url });
  };

  return (
    <div className="search-result">
      <div className="header">
        <div className="title">
          {(() => {
            // Buscar el valor del campo Db en los datos para usar el formato fancy
            const dbValue = intel?.value?.[0]?.Db || intel?.value?.[0]?.db;
            if (dbValue) {
              return formatName(dbValue);
            }
            // Si no hay campo Db, usar el nombre original
            return intel?.name ? formatName(intel.name) : '';
          })()}
        </div>
      </div>
      <div className="info">
        {intel?.value.map((subIntel, subIndex) => {
          // Excluir el campo Db/db del renderizado de los campos
          const entries = Object.entries(subIntel).filter(([key]) => key.toLowerCase() !== 'db');
          return (
            <div
              key={subIndex}
              className="text containersubintel"
              style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {entries.map(([key, value], idx) => (
                <Fragment key={idx}>
                  <div
                    className={`intel-row ${isFieldClickable(key, value ?? '') ? 'clickable-row' : ''}${['hash', 'salt', 'password'].includes(key.toLowerCase()) ? ' sensitive-data' : ''}`}
                    onClick={
                      isFieldClickable(key, value ?? '')
                        ? getFieldClickHandler(key, value ?? '')?.onClick
                        : undefined
                    }
                    title={
                      isFieldClickable(key, value ?? '')
                        ? getFieldClickHandler(key, value ?? '')?.title
                        : undefined
                    }
                    style={{ cursor: isFieldClickable(key, value ?? '') ? 'pointer' : 'default' }}>
                    <span
                      className="intel-label"
                      style={{ fontStyle: 'italic', fontFamily: 'Satoshi' }}>
                      {key === '_domain'
                        ? 'Domain'
                        : key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                      :{' '}
                    </span>
                    {renderIntelValue(key, value ?? '')}
                    {isFieldClickable(key, value ?? '') && (
                      <span className="intel-row-arrow">→</span>
                    )}
                  </div>
                  {/* Si la key es 'salt' y también hay un hash, renderizar crackeo después del salt */}
                  {key === 'salt' && subIntel.hash && renderCrackResults(subIntel, subIndex)}
                  {/* Si la key es 'hash' y NO hay salt, renderizar crackeo después del hash */}
                  {key === 'hash' && !subIntel.salt && renderCrackResults(subIntel, subIndex)}
                  {/* Renderizar resultados de geolocalización inmediatamente después de regip */}
                  {key === 'regip' && renderGeoResultsForIP(subIntel, subIndex, 'regip')}
                  {/* Renderizar resultados de geolocalización inmediatamente después de lastip */}
                  {key === 'lastip' && renderGeoResultsForIP(subIntel, subIndex, 'lastip')}
                </Fragment>
              ))}
              {/* Contenedor para botones en línea */}
              {(subIntel.hash || subIntel.regip || subIntel.lastip) && (
                <div className="crack-buttons-container">
                  {subIntel.hash && (
                    <button
                      onClick={() => handleCrackPassword(subIntel, subIndex)}
                      className="crack-btn"
                      disabled={crackStates[`${subIndex}-${subIntel.hash}`]?.isLoading}>
                      🌈 Crack password
                    </button>
                  )}
                  {subIntel.regip && (
                    <button
                      onClick={() => handleGeolocateIP(subIntel, subIndex, 'regip')}
                      className="crack-btn"
                      disabled={geoStates[`${subIndex}-regip-${subIntel.regip}`]?.isLoading}>
                      📍 Geolocate IP
                    </button>
                  )}
                  {subIntel.lastip && (
                    <button
                      onClick={() => handleGeolocateIP(subIntel, subIndex, 'lastip')}
                      className="crack-btn"
                      disabled={geoStates[`${subIndex}-lastip-${subIntel.lastip}`]?.isLoading}>
                      📍 Geolocate Last IP
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Modal para confirmación de links externos */}
      {externalModal.open && (
        <ModalWrapper action={() => setExternalModal({ open: false, url: '' })} showCloseBtn>
          <div style={{ padding: 24, minWidth: 320, textAlign: 'center' }}>
            <h3 style={{ marginBottom: 16 }}>Vas a salir de Codefend</h3>
            <p style={{ marginBottom: 24 }}>
              Estás a punto de abrir un enlace externo:
              <br />
              <span style={{ wordBreak: 'break-all', color: '#007bff' }}>{externalModal.url}</span>
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                className="btn-cancel codefend_secondary_ac"
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#eee',
                  color: '#222',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onClick={() => setExternalModal({ open: false, url: '' })}>
                Cancelar
              </button>
              <button
                className="btn-add codefend_main_ac limit-height"
                style={{
                  padding: '8px 20px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#ff3939',
                  color: '#fff',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  window.open(externalModal.url, '_blank', 'noopener,noreferrer');
                  setExternalModal({ open: false, url: '' });
                }}>
                Continuar
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};
