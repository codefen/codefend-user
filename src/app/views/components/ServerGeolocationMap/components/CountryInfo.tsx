import { COUNTRY_CODE_MAP } from '@/app/data/hooks/common/useCountryData';
import { memo } from 'react';

interface CountryInfoProps {
  currentCountry: string | null;
  countryData: Record<string, number>;
  mapResources?: Array<{
    server_pais_code: string;
    value: string | number;
    share?: string | number;
  }>;
  normalizedDataLength: number;
}

const CountryInfo = memo<CountryInfoProps>(
  ({ currentCountry, countryData, mapResources, normalizedDataLength }) => {
    if (!currentCountry) {
      return (
        <div
          className="info-group"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 30,
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}>
          <span>Found servers: {normalizedDataLength || 0}</span>
        </div>
      );
    }

    const countryCode = COUNTRY_CODE_MAP[currentCountry];
    let count = countryData[currentCountry] || 0;
    let percentage = '0.0';

    // Calculate percentage from mapResources if available
    if (mapResources && Array.isArray(mapResources)) {
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

      const code =
        Object.keys(CODE_TO_NAME).find(key => CODE_TO_NAME[key] === currentCountry) || '';
      const mr = mapResources.find((m: any) => (m.server_pais_code || '').toUpperCase() === code);

      if (mr && mr.share !== undefined) {
        percentage = String(mr.share);
      } else {
        const totalServers = normalizedDataLength || 0;
        percentage = totalServers > 0 ? ((count / totalServers) * 100).toFixed(1) : '0.0';
      }
    } else {
      const totalServers = normalizedDataLength || 0;
      percentage = totalServers > 0 ? ((count / totalServers) * 100).toFixed(1) : '0.0';
    }

    return (
      <div
        className="info-group"
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 30,
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}>
        {countryCode && (
          <span className={`flag flag-${countryCode}`} style={{ marginRight: 8 }}></span>
        )}
        <span>
          Found servers: {count} - {percentage}%
        </span>
      </div>
    );
  }
);

CountryInfo.displayName = 'CountryInfo';

export default CountryInfo;
