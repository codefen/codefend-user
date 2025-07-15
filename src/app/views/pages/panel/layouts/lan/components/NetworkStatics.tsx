import { type FC } from 'react';
import { StatAsset } from '@/app/views/components/stat-asset/StatAsset';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGetNetworkv2 } from '@resourcesHooks/network/useGetNetworkv2';

interface WebResourceStaticProps {
  externalIpCount: number;
  internalIpCount: number;
  totalNotUniqueIpCount: number;
}

// Reglas para determinar el tamaño de la empresa basado en IPs
const getCompanySize = (totalIPs: number): string => {
  if (totalIPs <= 50) return 'small';
  if (totalIPs <= 500) return 'medium';
  if (totalIPs <= 2000) return 'large';
  return 'enterprise';
};

// Descripción del tamaño de la empresa
const getCompanySizeDescription = (totalIPs: number): string => {
  const size = getCompanySize(totalIPs);
  const sizeDescriptions = {
    small: 'a small organization',
    medium: 'a medium-sized organization', 
    large: 'a large organization',
    enterprise: 'an enterprise-level organization'
  };
  return sizeDescriptions[size as keyof typeof sizeDescriptions];
};

// Mapeo de códigos de país a nombres y emojis
const countryCodeToNameAndFlag = (countryCode: string): { name: string; flag: string } => {
  const mapping: Record<string, { name: string; flag: string }> = {
    'ar': { name: 'Argentina', flag: '🇦🇷' },
    'us': { name: 'United States', flag: '🇺🇸' },
    'usa': { name: 'United States', flag: '🇺🇸' },
    'ca': { name: 'Canada', flag: '🇨🇦' },
    'gb': { name: 'United Kingdom', flag: '🇬🇧' },
    'uk': { name: 'United Kingdom', flag: '🇬🇧' },
    'de': { name: 'Germany', flag: '🇩🇪' },
    'fr': { name: 'France', flag: '🇫🇷' },
    'es': { name: 'Spain', flag: '🇪🇸' },
    'it': { name: 'Italy', flag: '🇮🇹' },
    'br': { name: 'Brazil', flag: '🇧🇷' },
    'au': { name: 'Australia', flag: '🇦🇺' },
    'nl': { name: 'Netherlands', flag: '🇳🇱' },
    'jp': { name: 'Japan', flag: '🇯🇵' },
    'cn': { name: 'China', flag: '🇨🇳' },
    'in': { name: 'India', flag: '🇮🇳' },
    'ru': { name: 'Russia', flag: '🇷🇺' },
    'mx': { name: 'Mexico', flag: '🇲🇽' },
    'za': { name: 'South Africa', flag: '🇿🇦' },
    'kr': { name: 'South Korea', flag: '🇰🇷' },
    'sg': { name: 'Singapore', flag: '🇸🇬' },
    'il': { name: 'Israel', flag: '🇮🇱' },
    'ch': { name: 'Switzerland', flag: '🇨🇭' },
    'at': { name: 'Austria', flag: '🇦🇹' },
    'be': { name: 'Belgium', flag: '🇧🇪' },
    'dk': { name: 'Denmark', flag: '🇩🇰' },
    'fi': { name: 'Finland', flag: '🇫🇮' },
    'no': { name: 'Norway', flag: '🇳🇴' },
    'se': { name: 'Sweden', flag: '🇸🇪' },
    'pl': { name: 'Poland', flag: '🇵🇱' },
    'pt': { name: 'Portugal', flag: '🇵🇹' },
    'cz': { name: 'Czech Republic', flag: '🇨🇿' },
    'gr': { name: 'Greece', flag: '🇬🇷' },
    'tr': { name: 'Turkey', flag: '🇹🇷' },
    'th': { name: 'Thailand', flag: '🇹🇭' },
    'my': { name: 'Malaysia', flag: '🇲🇾' },
    'id': { name: 'Indonesia', flag: '🇮🇩' },
    'ph': { name: 'Philippines', flag: '🇵🇭' },
    'vn': { name: 'Vietnam', flag: '🇻🇳' },
    'nz': { name: 'New Zealand', flag: '🇳🇿' },
    'cl': { name: 'Chile', flag: '🇨🇱' },
    'pe': { name: 'Peru', flag: '🇵🇪' },
    'co': { name: 'Colombia', flag: '🇨🇴' },
    'uy': { name: 'Uruguay', flag: '🇺🇾' },
    'ec': { name: 'Ecuador', flag: '🇪🇨' },
    'ro': { name: 'Romania', flag: '🇷🇴' },
    'bg': { name: 'Bulgaria', flag: '🇧🇬' },
    'hr': { name: 'Croatia', flag: '🇭🇷' },
    'si': { name: 'Slovenia', flag: '🇸🇮' },
    'sk': { name: 'Slovakia', flag: '🇸🇰' },
    'ee': { name: 'Estonia', flag: '🇪🇪' },
    'lv': { name: 'Latvia', flag: '🇱🇻' },
    'lt': { name: 'Lithuania', flag: '🇱🇹' },
    'is': { name: 'Iceland', flag: '🇮🇸' },
    'ie': { name: 'Ireland', flag: '🇮🇪' },
    'lu': { name: 'Luxembourg', flag: '🇱🇺' },
    'mt': { name: 'Malta', flag: '🇲🇹' },
    'cy': { name: 'Cyprus', flag: '🇨🇾' },
  };
  
  const key = countryCode?.toLowerCase?.() || '';
  return mapping[key] || { name: 'Unknown', flag: '🌍' };
};

// Función para calcular el país con más assets
const getMostAssetsLocation = (networkData: any[]): { country: string; flag: string; count: number } => {
  if (!networkData || networkData.length === 0) {
    return { country: 'Unknown', flag: '🌍', count: 0 };
  }

  // Contar assets por país
  const countryCount: Record<string, number> = {};
  
  networkData.forEach(device => {
    // Usar tanto el país como el código de país para obtener el nombre correcto
    const countryCode = device.server_pais_code?.toLowerCase?.() || '';
    const countryName = device.server_pais || '';
    
    // Priorizar el mapeo por código de país si está disponible
    const { name: mappedCountryName } = countryCodeToNameAndFlag(countryCode);
    const finalCountryName = mappedCountryName !== 'Unknown' ? mappedCountryName : countryName;
    
    if (finalCountryName && finalCountryName !== 'Unknown') {
      countryCount[finalCountryName] = (countryCount[finalCountryName] || 0) + 1;
    }
  });

  // Encontrar el país con más assets
  let maxCount = 0;
  let mostAssetsCountry = 'Unknown';
  
  Object.entries(countryCount).forEach(([country, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostAssetsCountry = country;
    }
  });

  // Obtener la bandera del país con más assets
  let flag = '🌍';
  
  // Buscar en todos los códigos para encontrar la bandera correcta
  const codes = ['ar', 'us', 'ca', 'gb', 'de', 'fr', 'es', 'it', 'br', 'au', 'nl', 'jp', 'cn', 'in', 'ru', 'mx', 'za', 'kr', 'sg', 'il', 'ch', 'at', 'be', 'dk', 'fi', 'no', 'se', 'pl', 'pt', 'cz', 'gr', 'tr', 'th', 'my', 'id', 'ph', 'vn', 'nz', 'cl'];
  for (const code of codes) {
    const data = countryCodeToNameAndFlag(code);
    if (data.name === mostAssetsCountry) {
      flag = data.flag;
      break;
    }
  }

  return { country: mostAssetsCountry, flag, count: maxCount };
};

// Función para obtener el scope name
const getScopeName = (company: any): string => {
  if (!company) return 'Unknown';
  
  // Priorizar el dominio web de la empresa
  if (company.web && company.web !== '-' && company.web !== 'pending-onboarding.temp') {
    // Limpiar el dominio (remover protocolo y www)
    let domain = company.web;
    domain = domain.replace(/^https?:\/\//, '');
    domain = domain.replace(/^www\./, '');
    domain = domain.replace(/\/$/, '');
    return domain;
  }
  
  // Fallback al nombre de la empresa
  if (company.name && company.name !== 'Unknown') {
    return company.name;
  }
  
  return 'Unknown';
};
export const NetworkStatics: FC<WebResourceStaticProps> = ({
  externalIpCount,
  internalIpCount,
  totalNotUniqueIpCount,
}) => {
  const { company } = useUserData();
  const { networks } = useGetNetworkv2();
  
  // Calcular análisis dinámico
  const scopeName = getScopeName(company.get);
  const mostAssetsLocation = getMostAssetsLocation(networks);
  const companySizeDescription = getCompanySizeDescription(totalNotUniqueIpCount);
  
  return (
    <>
      {/* Network Analysis Section */}
      <div className="card">
        <div className="header">
          <span>Network analysis:</span>
        </div>
        <div className="content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>- Scope name:</span>
              <span style={{ color: '#20c997' }}>{scopeName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>- Assets location:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {mostAssetsLocation.flag} 
                <span>
                  has most of it's servers in {mostAssetsLocation.country}
                  {mostAssetsLocation.count > 0 && ` (${mostAssetsLocation.count} servers)`}
                </span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '500' }}>- Business size:</span>
              <span>
                Considering the network infrastructure, {scopeName} is {companySizeDescription}.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* IP Statistics */}
      <div className="flex-box">
        <StatAsset value={externalIpCount} valueTitle="External IPs" />
        <StatAsset value={internalIpCount} valueTitle="Internal IPs" />
        <StatAsset value={totalNotUniqueIpCount} valueTitle="Total IPs" />
      </div>
    </>
  );
};
