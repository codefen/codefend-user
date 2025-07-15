import { useMemo } from 'react';
import { MetricsService } from '@utils/metric.service.ts';

interface NetworkDevice {
  server_pais?: string;
  server_pais_code?: string;
}

interface MapResource {
  server_pais_code: string;
  value: string | number;
  percentage?: number;
  share?: string | number;
}

interface LocationMetric {
  location: { country: string; countryCode: string };
  count: number;
  percentage: string;
  country: string;
  countryCode: string;
}

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
};

export const useLocationMetrics = (
  normalizedData: NetworkDevice[],
  mapResources?: MapResource[],
  resourceType?: string
): LocationMetric[] => {
  return useMemo(() => {
    // Safety check: ensure normalizedData exists and is an array
    if (!normalizedData || !Array.isArray(normalizedData)) {
      return [];
    }

    // Si mapResources viene del backend, usarlo para la tabla
    if (
      mapResources &&
      Array.isArray(mapResources) &&
      mapResources.length > 0 &&
      mapResources[0].share !== undefined
    ) {
      return mapResources.map((mr: MapResource) => {
        const code = (mr.server_pais_code || '').toUpperCase();
        const country = CODE_TO_NAME[code] || code || 'unknown';
        return {
          location: { country, countryCode: code },
          count: Number(mr.value),
          percentage: String(mr.share),
          country,
          countryCode: code,
        };
      });
    }

    // Si no, usar el método tradicional con MetricsService
    const metrics = MetricsService.getCountryMetrics(normalizedData, resourceType || 'network');
    return metrics.map((metric: any) => ({
      location: metric,
      count: metric.count,
      percentage: metric.percentage,
      country: metric.country,
      countryCode: metric.countryCode,
    }));
  }, [normalizedData, mapResources, resourceType]);
};
