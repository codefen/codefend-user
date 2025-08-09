import { useMemo } from 'react';

// País interfaces
interface NetworkDevice {
  all_found_domains?: string;
  all_found_domains_value?: string;
  server_pais?: string;
  server_pais_code?: string;
  server_pais_provincia?: string;
  server_pais_ciudad?: string;
  device_class?: string;
  neuroscan_id?: string;
  neuroscan_main_domain?: string;
  source?: string;
}

interface MapResource {
  server_pais_code: string;
  value: string | number;
  percentage?: number;
  share?: string | number;
}

interface CountryDataResult {
  normalizedData: NetworkDevice[];
  countryData: Record<string, number>;
  maxCount: number;
  countryRanking: Record<string, number>;
  countriesWithServers: Array<{ name: string; count: number }>;
}

// Country name mapping para normalización
const NAME_MAPPING: Record<string, string> = {
  US: 'USA',
  'United States': 'USA',
  'United States of America': 'USA',
  Brasil: 'Brazil',
  UK: 'United Kingdom',
  'Great Britain': 'United Kingdom',
  Holland: 'Netherlands',
  Deutschland: 'Germany',
  Alemania: 'Germany',
  España: 'Spain',
  'España (Spain)': 'Spain',
  México: 'Mexico',
  Australie: 'Australia',
  Argentine: 'Argentina',
  Suisse: 'Switzerland',
  Suiza: 'Switzerland',
  Österreich: 'Austria',
  Italia: 'Italy',
  Francia: 'France',
  Canadá: 'Canada',
  'Países Bajos': 'Netherlands',
  'Países bajos': 'Netherlands',
  'Países Bajos (Netherlands)': 'Netherlands',
  'Reino Unido': 'United Kingdom',
  'Reino Unido (UK)': 'United Kingdom',
  Rusia: 'Russia',
  Japón: 'Japan',
  China: 'China',
  India: 'India',
  Sudáfrica: 'South Africa',
  Bélgica: 'Belgium',
  Suède: 'Sweden',
  Suecia: 'Sweden',
  Noruega: 'Norway',
  Dinamarca: 'Denmark',
  Finlandia: 'Finland',
  Irlanda: 'Ireland',
  Grecia: 'Greece',
  Turquía: 'Turkey',
  Israel: 'Israel',
  Singapur: 'Singapore',
  'Corea del Sur': 'South Korea',
  Tailandia: 'Thailand',
  Malasia: 'Malaysia',
  Indonesia: 'Indonesia',
  Filipinas: 'Philippines',
  Vietnam: 'Vietnam',
  'Nueva Zelanda': 'New Zealand',
  Chile: 'Chile',
} as const;

// Country code to name mapping
const CODE_TO_NAME: Record<string, string> = {
  US: 'USA',
  AR: 'Argentina',
  NL: 'Netherlands',
  DE: 'Germany',
  CL: 'Chile',
  ES: 'Spain',
  CA: 'Canada',
  FR: 'France',
  BE: 'Belgium',
  CH: 'Switzerland',
  AT: 'Austria',
  PT: 'Portugal',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  BG: 'Bulgaria',
  HR: 'Croatia',
  SI: 'Slovenia',
  SK: 'Slovakia',
  EE: 'Estonia',
  LV: 'Latvia',
  LT: 'Lithuania',
  FI: 'Finland',
  DK: 'Denmark',
  IS: 'Iceland',
  IE: 'Ireland',
  GR: 'Greece',
  TR: 'Turkey',
  IL: 'Israel',
  SG: 'Singapore',
  KR: 'South Korea',
  TH: 'Thailand',
  MY: 'Malaysia',
  ID: 'Indonesia',
  PH: 'Philippines',
  VN: 'Vietnam',
  NZ: 'New Zealand',
  RU: 'Russia',
  CN: 'China',
  IN: 'India',
  JP: 'Japan',
  ZA: 'South Africa',
  MX: 'Mexico',
  GB: 'United Kingdom',
  AU: 'Australia',
  '': 'unknown',
} as const;

// Country code mapping para lowercase codes
const LOWERCASE_CODE_MAP: Record<string, string> = {
  us: 'USA',
  ar: 'Argentina',
  de: 'Germany',
  es: 'Spain',
  fr: 'France',
  it: 'Italy',
  br: 'Brazil',
  gb: 'United Kingdom',
  nl: 'Netherlands',
  au: 'Australia',
  ca: 'Canada',
  ru: 'Russia',
  cn: 'China',
  in: 'India',
  jp: 'Japan',
  za: 'South Africa',
  mx: 'Mexico',
  be: 'Belgium',
  ch: 'Switzerland',
  at: 'Austria',
  pt: 'Portugal',
  pl: 'Poland',
  cz: 'Czech Republic',
  hu: 'Hungary',
  ro: 'Romania',
  bg: 'Bulgaria',
  hr: 'Croatia',
  si: 'Slovenia',
  sk: 'Slovakia',
  ee: 'Estonia',
  lv: 'Latvia',
  lt: 'Lithuania',
  fi: 'Finland',
  dk: 'Denmark',
  is: 'Iceland',
  ie: 'Ireland',
  gr: 'Greece',
  tr: 'Turkey',
  il: 'Israel',
  sg: 'Singapore',
  kr: 'South Korea',
  th: 'Thailand',
  my: 'Malaysia',
  id: 'Indonesia',
  ph: 'Philippines',
  vn: 'Vietnam',
  nz: 'New Zealand',
  cl: 'Chile',
} as const;

// Coordenadas geográficas para países (longitud, latitud)
export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  Argentina: [-64.0, -34.0],
  USA: [-95.0, 39.0],
  Canada: [-106.0, 60.0],
  Netherlands: [5.75, 52.5],
  Australia: [133.0, -27.0],
  Brazil: [-55.0, -10.0],
  'United Kingdom': [-2.0, 54.0],
  France: [2.0, 46.0],
  Germany: [9.0, 51.0],
  Spain: [-4.0, 40.0],
  Italy: [12.0, 42.0],
  Russia: [105.0, 61.0],
  China: [104.0, 35.0],
  India: [78.0, 20.0],
  Japan: [138.0, 36.0],
  'South Africa': [22.0, -31.0],
  Mexico: [-102.0, 23.0],
  Belgium: [4.5, 50.8],
  Switzerland: [8.2, 46.8],
  Austria: [14.5, 47.5],
  Portugal: [-8.0, 39.5],
  Poland: [19.0, 52.0],
  'Czech Republic': [15.5, 49.75],
  Hungary: [20.0, 47.0],
  Romania: [25.0, 46.0],
  Bulgaria: [25.0, 43.0],
  Croatia: [15.5, 45.0],
  Slovenia: [14.5, 46.0],
  Slovakia: [19.5, 48.7],
  Estonia: [26.0, 59.0],
  Latvia: [25.0, 57.0],
  Lithuania: [24.0, 56.0],
  Finland: [26.0, 64.0],
  Denmark: [10.0, 56.0],
  Iceland: [-18.0, 65.0],
  Ireland: [-8.0, 53.0],
  Greece: [22.0, 39.0],
  Turkey: [35.0, 39.0],
  Israel: [34.8, 31.0],
  Singapore: [103.8, 1.3],
  'South Korea': [128.0, 36.0],
  Thailand: [100.0, 15.0],
  Malaysia: [112.0, 2.5],
  Indonesia: [113.0, -0.8],
  Philippines: [122.0, 13.0],
  Vietnam: [108.0, 14.0],
  'New Zealand': [174.0, -41.0],
  Chile: [-71.0, -30.0],
} as const;

// Country code to flag code mapping
export const COUNTRY_CODE_MAP: Record<string, string> = {
  Argentina: 'ar',
  USA: 'us',
  Canada: 'ca',
  Netherlands: 'nl',
  Australia: 'au',
  Brazil: 'br',
  'United Kingdom': 'gb',
  France: 'fr',
  Germany: 'de',
  Spain: 'es',
  Italy: 'it',
  Russia: 'ru',
  China: 'cn',
  India: 'in',
  Japan: 'jp',
  'South Africa': 'za',
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
} as const;

// Función utilitaria para normalizar los datos de país (optimizada)
const normalizeCountryData = (data: NetworkDevice[]): NetworkDevice[] => {
  if (!Array.isArray(data)) return [];

  return data.map(item => {
    let country = (item.server_pais || '').trim();
    if (NAME_MAPPING[country]) {
      country = NAME_MAPPING[country];
    } else if (!country && item.server_pais_code) {
      // Si no hay country, intentar con el código
      const code = (item.server_pais_code || '').toLowerCase();
      if (LOWERCASE_CODE_MAP[code]) {
        country = LOWERCASE_CODE_MAP[code];
      }
    }
    return { ...item, server_pais: country };
  });
};

export const useCountryData = (
  networkData: NetworkDevice[],
  mapResources?: MapResource[]
): CountryDataResult => {
  // Normalizar datos una sola vez con memoización estable
  const normalizedData = useMemo(() => {
    return normalizeCountryData(networkData);
  }, [networkData]);

  // Crear conteo de países optimizado
  const countryData = useMemo(() => {
    if (mapResources && Array.isArray(mapResources) && mapResources.length > 0) {
      const counts: Record<string, number> = {};
      mapResources.forEach(({ server_pais_code, value }) => {
        const code = (server_pais_code || '').toUpperCase();
        const name = CODE_TO_NAME[code] || code || 'unknown';
        const val = typeof value === 'string' ? parseInt(value, 10) : Number(value);
        if (name && !isNaN(val)) {
          counts[name] = val;
        }
      });
      return counts;
    }

    // Fallback al método tradicional
    return normalizedData.reduce(
      (acc, item) => {
        const country = item.server_pais;
        if (country && country !== 'unknown') {
          acc[country] = (acc[country] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );
  }, [mapResources, normalizedData]);

  // Calcular max count
  const maxCount = useMemo(() => {
    const values = Object.values(countryData);
    return values.length > 0 ? Math.max(...values.map(v => Number(v))) : 1;
  }, [countryData]);

  // Crear ranking optimizado
  const countryRanking = useMemo(() => {
    const sortedCountries = Object.entries(countryData)
      .filter(([_, count]) => Number(count) > 0)
      .sort(([, a], [, b]) => Number(b) - Number(a));

    const ranking: Record<string, number> = {};
    sortedCountries.forEach(([countryName], index) => {
      ranking[countryName] = index + 1; // 1-based ranking
    });

    return ranking;
  }, [countryData]);

  // Países con servidores para auto-rotación
  const countriesWithServers = useMemo(() => {
    return Object.entries(countryData)
      .filter(([countryName, count]) => {
        return Number(count) > 0 && COUNTRY_COORDINATES[countryName];
      })
      .sort(([, a], [, b]) => Number(b) - Number(a))
      .map(([countryName, count]) => ({
        name: countryName,
        count: Number(count),
      }));
  }, [countryData]);

  return {
    normalizedData,
    countryData,
    maxCount,
    countryRanking,
    countriesWithServers,
  };
};
