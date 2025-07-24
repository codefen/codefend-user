import { useShowScreen } from '#commonHooks/useShowScreen';
import { useDashboard } from '@panelHooks/index';
import { VulnerabilitiesStatus } from '@/app/views/components/VulnerabilitiesStatus/VulnerabilitiesStatus';
import { VulnerabilityRisk } from '@/app/views/components/VulnerabilityRisk/VulnerabilityRisk';
import { TeamMemberPageHeader } from './components/TeamMemberPageHeader';
import { TeamMembersTableCard } from './components/TeamMembersTableCard';
import { DashboardScanStart } from '@/app/views/components/DashboardScanStart/DashboardScanStart';
import './teammembers.scss';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

// Función para formatear el tamaño del negocio
const formatBusinessSize = (size: string): string => {
  if (!size) return 'Unknown';
  
  // Convertir formatos como "201-500" a "201 to 500 people"
  const sizeMatch = size.match(/^(\d+)-(\d+)$/);
  if (sizeMatch) {
    const [, min, max] = sizeMatch;
    return `${min} to ${max} people`;
  }
  
  // Otros formatos comunes
  const formatMap: Record<string, string> = {
    '1-10': '1 to 10 people',
    '11-50': '11 to 50 people',
    '51-200': '51 to 200 people',
    '201-500': '201 to 500 people',
    '501-1000': '501 to 1000 people',
    '1000+': '1000+ people',
    'startup': 'Startup',
    'small': 'Small business',
    'medium': 'Medium business',
    'large': 'Large business',
    'enterprise': 'Enterprise'
  };
  
  return formatMap[size] || size;
};

// Función para normalizar códigos de país (usando el mismo mapeo que otros componentes)
const normalizeCountryCode = (countryCode: string): string => {
  if (!countryCode) return '';
  
  // Mapeo de códigos de país comunes a códigos estándar para las banderas CSS
  const countryCodeMap: Record<string, string> = {
    'AR': 'ar', 'Argentina': 'ar',
    'US': 'us', 'USA': 'us', 'United States': 'us',
    'CA': 'ca', 'Canada': 'ca',
    'GB': 'gb', 'UK': 'gb', 'United Kingdom': 'gb',
    'DE': 'de', 'Germany': 'de',
    'FR': 'fr', 'France': 'fr',
    'ES': 'es', 'Spain': 'es',
    'IT': 'it', 'Italy': 'it',
    'BR': 'br', 'Brazil': 'br',
    'AU': 'au', 'Australia': 'au',
    'NL': 'nl', 'Netherlands': 'nl',
    'JP': 'jp', 'Japan': 'jp',
    'CN': 'cn', 'China': 'cn',
    'IN': 'in', 'India': 'in',
    'RU': 'ru', 'Russia': 'ru',
    'MX': 'mx', 'Mexico': 'mx',
    'ZA': 'za', 'South Africa': 'za',
    'KR': 'kr', 'South Korea': 'kr',
    'SG': 'sg', 'Singapore': 'sg',
    'IL': 'il', 'Israel': 'il',
    'CH': 'ch', 'Switzerland': 'ch',
    'AT': 'at', 'Austria': 'at',
    'BE': 'be', 'Belgium': 'be',
    'DK': 'dk', 'Denmark': 'dk',
    'FI': 'fi', 'Finland': 'fi',
    'NO': 'no', 'Norway': 'no',
    'SE': 'se', 'Sweden': 'se',
    'PL': 'pl', 'Poland': 'pl',
    'PT': 'pt', 'Portugal': 'pt',
    'CZ': 'cz', 'Czech Republic': 'cz',
    'GR': 'gr', 'Greece': 'gr',
    'TR': 'tr', 'Turkey': 'tr',
    'TH': 'th', 'Thailand': 'th',
    'MY': 'my', 'Malaysia': 'my',
    'ID': 'id', 'Indonesia': 'id',
    'PH': 'ph', 'Philippines': 'ph',
    'VN': 'vn', 'Vietnam': 'vn',
    'NZ': 'nz', 'New Zealand': 'nz',
    'CL': 'cl', 'Chile': 'cl',
    'PE': 'pe', 'Peru': 'pe',
    'CO': 'co', 'Colombia': 'co',
    'UY': 'uy', 'Uruguay': 'uy',
    'EC': 'ec', 'Ecuador': 'ec',
    'RO': 'ro', 'Romania': 'ro',
    'BG': 'bg', 'Bulgaria': 'bg',
    'HR': 'hr', 'Croatia': 'hr',
    'SI': 'si', 'Slovenia': 'si',
    'SK': 'sk', 'Slovakia': 'sk',
    'EE': 'ee', 'Estonia': 'ee',
    'LV': 'lv', 'Latvia': 'lv',
    'LT': 'lt', 'Lithuania': 'lt',
    'IS': 'is', 'Iceland': 'is',
    'IE': 'ie', 'Ireland': 'ie',
    'LU': 'lu', 'Luxembourg': 'lu',
    'MT': 'mt', 'Malta': 'mt',
    'CY': 'cy', 'Cyprus': 'cy',
    'NG': 'ng', 'Nigeria': 'ng',
    'EG': 'eg', 'Egypt': 'eg',
    'KE': 'ke', 'Kenya': 'ke',
    'MA': 'ma', 'Morocco': 'ma',
    'TN': 'tn', 'Tunisia': 'tn',
    'DZ': 'dz', 'Algeria': 'dz'
  };
  
  // Primero intenta el mapeo directo
  const mappedCode = countryCodeMap[countryCode.toUpperCase()];
  if (mappedCode) return mappedCode;
  
  // Si no encuentra mapeo, devuelve el código en minúsculas
  return countryCode.toLowerCase();
};

export const TeamMembersPage = () => {
  const [showScreen] = useShowScreen();
  const { isLoading, data } = useDashboard();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.TEAM_PAGE_CONDITION);
    }
  }, []);
  return (
    <main
      className={
        `team-members ${showScreen ? 'actived' : ''}` +
        `${!isDesktop ? ' sidebar-mobile-active' : ''}`
      }>
      <section className="left">
        <div className="box-assets">
          <TeamMemberPageHeader />
        </div>
        <VulnerabilitiesStatus
          isLoading={isLoading}
          vulnerabilityByShare={data?.issues_condicion || {}}
        />
        <TeamMembersTableCard isLoading={isLoading} members={data?.members || []} />
        {/* Card de información de la compañía */}
        {data?.company && (
          <div className="card company-info-card">
            <div className="header">
              <h2>Business details</h2>
            </div>
            <div className="company-info-content">
              <div className="company-info-item">
                <span className="single-line"><strong>Business ID:</strong> {data.company.id}</span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line"><strong>Business name:</strong> {data.company.name}</span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line area-line">
                  <strong>Area:</strong> {data.company.pais_code && (
                    <span className={`flag flag-${normalizeCountryCode(data.company.pais_code)}`}></span>
                  )}
                  {[data.company.pais_provincia, data.company.pais_ciudad]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line"><strong>Web:</strong> {data.company.web || '-'}</span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line"><strong>Business size:</strong> {formatBusinessSize(data.company.size)}</span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line">
                  <strong>Owner:</strong> {[data.company.owner_fname, data.company.owner_lname]
                    .filter(Boolean)
                    .join(' ')}
                </span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line"><strong>Owner email:</strong> {data.company.owner_email}</span>
              </div>
              
              <div className="company-info-item">
                <span className="single-line"><strong>Current plan:</strong> {data.company.plan}</span>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="right">
        <Navbar />
        <DashboardScanStart />
        <VulnerabilitiesStatus
          isLoading={isLoading}
          vulnerabilityByShare={data?.issues_condicion || {}}
        />
        <VulnerabilityRisk vulnerabilityByRisk={data?.issues_share || {}} isLoading={isLoading} />
      </section>
    </main>
  );
};
