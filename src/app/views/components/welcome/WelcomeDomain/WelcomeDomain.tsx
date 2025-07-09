import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { ModalWrapper } from '@modals/index';
import Tablev3 from '@table/v3/Tablev3';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import './welcomedomain.scss';
import { AimIcon } from '@icons';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import TextChild from '@/app/views/components/utils/TextChild';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import { toast } from '@/app/data/utils';
import { PrimaryButton } from '@buttons/index';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import { useAutoScan } from '@moduleHooks/newscanner/useAutoScan';

const columns = [
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-welcome-1',
    weight: '42%',
    render: (row: any, next?: any) =>
      !row?.address_domain ? (
        row?.resource_domain
      ) : (
        <TextChild
          subNetwork={row?.address_domain}
          isLast={!next || (next && !next?.address_domain)}
        />
      ),
  },
  {
    header: 'server ip',
    key: 'main_server',
    styles: 'item-cell-welcome-2',
    weight: '26%',
    render: (ip: any) => (ip === 'unreachable' ? 'non available' : ip),
  },
  {
    header: 'area',
    key: 'main_server_area_name',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-welcome-3',
    weight: '32%',
    render: (row: any) => (
      <LocationItem
        country={row?.main_server_area_name || 'non available'}
        countryCode={row?.main_server_area_code || ''}
      />
    ),
  },
];

export const WelcomeDomain = ({
  close,
  goToStartScanStep,
}: {
  close: () => void;
  goToStartScanStep: () => Promise<void>;
}) => {
  const [emailValue, setEmailValue] = useState('');
  const [websiteValue, setWebsiteValue] = useState('');
  const [domains, setDomains] = useState<any[]>([]);
  const [fetcher, cancel, isLoading] = useFetcher();
  const { getCompany, logout, user, company } = useUserData();
  const domainCount = useGlobalFastField('domainCount');
  const { update, initialDomain: initialDomainStored } = useInitialDomainStore();
  const [loading, setLoading] = useState(false);
  const [scopeType, setScopeType] = useState<'email' | 'website' | null>(null);
  const { autoScan } = useAutoScan();

  // Campo actual según el tipo de scope
  const currentValue = scopeType === 'email' ? emailValue : websiteValue;
  const setCurrentValue = scopeType === 'email' ? setEmailValue : setWebsiteValue;

  // Función para manejar el cambio de input con detección automática MEJORADA
  const handleInputChange = (value: string) => {
    const previousValue = scopeType === 'email' ? emailValue : websiteValue;
    
    // SIEMPRE actualizar el campo actual primero
    if (scopeType === 'email') {
      setEmailValue(value);
    } else {
      setWebsiteValue(value);
    }
    
    // Si el campo está vacío o se está borrando, NO cambiar el scope automáticamente
    if (value.trim() === '' || value.length < previousValue.length) {
      return; // Solo actualizar valor, no cambiar scope
    }
    
    // DETECCIÓN AUTOMÁTICA MÁS CONSERVADORA
    // Solo cambiar scope en casos muy específicos y claros
    if (scopeType === 'email' && isObviousDomain(value)) {
      // CASO 1: Usuario está en "personal email" pero escribió claramente un dominio/URL
      setScopeType('website');
      setWebsiteValue(value);
      setEmailValue('');
    } else if (scopeType === 'website' && isObviousEmail(value)) {
      // CASO 2: Usuario está en "business website" pero escribió claramente un email
      setScopeType('email');
      setEmailValue(value);
      setWebsiteValue('');
    }
  };

  // Función para detectar si es email completo
  const isEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  // Función CONSERVADORA para detectar dominios OBVIOS únicamente
  const isObviousDomain = (input: string): boolean => {
    if (input.includes('@')) return false; // Si tiene @, definitivamente no es dominio
    
    const trimmed = input.trim().toLowerCase();
    if (trimmed.length < 5) return false; // Muy corto para ser dominio válido
    
    // Solo detectar patrones MUY ESPECÍFICOS que son claramente dominios
    const obviousDomainPatterns = [
      /^https?:\/\//, // URL completa con protocolo
      /^www\.[\w-]+\.[\w]{2,}/, // Empieza con www. seguido de dominio.tld
      /^[\w-]+\.com$/i, // termina específicamente en .com
      /^[\w-]+\.org$/i, // termina específicamente en .org  
      /^[\w-]+\.net$/i, // termina específicamente en .net
      /^[\w-]+\.edu$/i, // termina específicamente en .edu
      /^[\w-]+\.gov$/i, // termina específicamente en .gov
      /^[\w-]+\.io$/i,  // termina específicamente en .io
      /^[\w-]+\.co$/i,  // termina específicamente en .co
    ];
    
    return obviousDomainPatterns.some(pattern => pattern.test(trimmed));
  };

  // Función CONSERVADORA para detectar emails OBVIOS únicamente
  const isObviousEmail = (input: string): boolean => {
    const trimmed = input.trim();
    
    // Solo detectar si contiene @ y tiene estructura básica de email
    if (!trimmed.includes('@')) return false;
    
    // Detectar patrones obvios de email
    const obviousEmailPatterns = [
      /@gmail\./i,     // emails de Gmail
      /@yahoo\./i,     // emails de Yahoo
      /@hotmail\./i,   // emails de Hotmail
      /@outlook\./i,   // emails de Outlook
      /@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/, // patrón básico con @ y dominio válido
    ];
    
    return obviousEmailPatterns.some(pattern => pattern.test(trimmed));
  };

  // Función auxiliar para detectar si contiene @ (para otras validaciones)
  const containsAt = (input: string): boolean => {
    return input.includes('@');
  };

  // Función auxiliar mejorada para detectar si parece un dominio (para preview)
  const seemsLikeDomain = (input: string): boolean => {
    if (input.includes('@')) return false; // Si tiene @, es email
    
    const trimmed = input.trim().toLowerCase();
    if (trimmed.length < 4) return false; // Muy corto para ser dominio
    
    // Para el preview, ser un poco más permisivo pero aún conservador
    const domainPatterns = [
      /^https?:\/\//, // URL completa
      /^www\./, // Empieza con www.
      /\.(com|org|net|edu|gov|mil|int|co|io|me|tech|dev|app|ly|ai|cc|tv|fm|tk|es|uk|de|fr|it|br|mx|ar|cl|pe|ve)$/i, // Termina con TLD común
      /^[\w-]+\.[\w]{2,3}$/, // Patrón básico con TLD de 2-3 caracteres
    ];
    
    return trimmed.includes('.') && domainPatterns.some(pattern => pattern.test(trimmed));
  };

  // Función de test para verificar la nueva detección CONSERVADORA (solo para desarrollo)
  const testDetection = () => {
    const testCases = [
      // Casos que DEBEN detectarse como dominio obvio
      { input: 'google.com', expected: 'obvious_domain' },
      { input: 'www.google.com', expected: 'obvious_domain' },
      { input: 'https://facebook.com', expected: 'obvious_domain' },
      { input: 'mi-sitio.io', expected: 'obvious_domain' },
      { input: 'example.org', expected: 'obvious_domain' },
      
      // Casos que DEBEN detectarse como email obvio
      { input: 'test@gmail.com', expected: 'obvious_email' },
      { input: 'user@yahoo.com', expected: 'obvious_email' },
      { input: 'admin@domain.com', expected: 'obvious_email' },
      
      // Casos que NO deben cambiar automáticamente (IMPORTANTE)
      { input: 'chris.russo', expected: 'none' }, // ✅ NO debe detectarse como dominio
      { input: 'john.doe', expected: 'none' },    // ✅ NO debe detectarse como dominio
      { input: 'texto', expected: 'none' },
      { input: 'clarin', expected: 'none' },
      { input: 'www', expected: 'none' },
      { input: 'admin@', expected: 'none' },      // Email incompleto no debe cambiar
    ];
    
    console.log('🧪 Testing CONSERVATIVE detection logic:');
    testCases.forEach(({ input, expected }) => {
      const isObviousDom = isObviousDomain(input);
      const isObviousEm = isObviousEmail(input);
      let result = 'none';
      if (isObviousDom) result = 'obvious_domain';
      else if (isObviousEm) result = 'obvious_email';
      
      const status = result === expected ? '✅' : '❌';
      console.log(`${status} "${input}" -> ${result} (expected: ${expected})`);
    });
  };

  // Test de detección disponible para desarrollo
  // useEffect(() => { testDetection(); }, []);

  // Detectar si es usuario personal
  const isPersonalUser = () => {
    const currentUser = user.get;
    const currentCompany = company.get;
    
    // Verificar si es usuario personal basado en los datos disponibles
    if (currentCompany?.name === 'Personal Business' || 
        currentCompany?.web === '-' ||
        currentCompany?.size === '1-10' && currentCompany?.web === '-') {
      return true;
    }
    
    return false;
  };

  // Detectar si hay company website del onboarding
  const hasCompanyWebsite = () => {
    const currentCompany = company.get;
    return currentCompany?.web && 
           currentCompany.web !== '-' && 
           currentCompany.web !== 'pending-onboarding.temp' &&
           currentCompany.web.trim() !== '';
  };
  // Estado para controlar si se ha inicializado una vez
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Solo ejecutar la inicialización una vez
    if (hasInitialized) return;
    
    // Inicializar valores desde el store si están disponibles
    if (initialDomainStored) {
      if (isEmail(initialDomainStored)) {
        setEmailValue(initialDomainStored);
      } else {
        setWebsiteValue(initialDomainStored);
      }
    }
    
    // Preseleccionar el tipo de scope según el tipo de usuario
    if (scopeType === null) {
      if (isPersonalUser()) {
        setScopeType('email');
        // Para usuarios personales, usar el email del usuario solo si no hay valor
        const currentUser = user.get;
        if (currentUser?.email && !emailValue && !initialDomainStored) {
          setEmailValue(currentUser.email);
        }
      } else if (hasCompanyWebsite()) {
        setScopeType('website');
        // Para usuarios empresariales, usar el dominio solo si no hay valor inicial
        const currentCompany = company.get;
        if (currentCompany?.web && !websiteValue && !initialDomainStored) {
          setWebsiteValue(currentCompany.web);
        }
      } else {
        // Default para empresas sin website
        setScopeType('website');
      }
    }
    
    // Marcar como inicializado
    setHasInitialized(true);
  }, [hasInitialized, initialDomainStored, scopeType]);

  // useEffect separado para el preview que solo se ejecuta con websiteValue válido
  useEffect(() => {
    if (!hasInitialized) return;
    
    // Solo hacer preview si hay un dominio válido y no es email
    if (scopeType === 'website' && 
        websiteValue && 
        websiteValue.trim().length > 0 && 
        !isEmail(websiteValue) &&
        seemsLikeDomain(websiteValue)) {
      
      const companyID = getCompany();
      fetcher('post', {
        requireSession: true,
        body: {
          company_id: companyID,
          resource_address_domain: websiteValue,
          subdomain_scan: 'yes',
        },
        path: 'resources/web/preview',
        timeout: 230000,
        requestId: 'welcome-domain-preview',
      }).then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (!apiErrorValidation(data)) {
          setDomains(data?.resource ? [data.resource] : []);
        } else if (data?.error_info === 'unrecheable_domain') {
          toast.error(data?.info);
        }
      });
    } else if (scopeType === 'website' && (!websiteValue || websiteValue.trim() === '')) {
      // Limpiar dominios cuando el campo está vacío
      setDomains([]);
    }
  }, [websiteValue, hasInitialized, scopeType]);

  const changeInitialDomain = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Solo hacer preview para websites, no para emails personales
    if (scopeType !== 'email' && websiteValue) {
      const companyID = getCompany();
      fetcher('post', {
        requireSession: true,
        body: {
          company_id: companyID,
          resource_address_domain: websiteValue,
          subdomain_scan: 'yes',
        },
        path: 'resources/web/preview',
        timeout: 230000,
        requestId: 'welcome-domain-preview',
      }).then(({ data }: any) => {
        if (verifySession(data, logout)) return;
        if (!apiErrorValidation(data)) {
          setDomains(data?.resource ? [data.resource] : []);
        } else if (data?.error_info === 'unrecheable_domain') {
          toast.error(data?.info);
        }
      });
    }
  };

  const nextStep = () => {
    if (!currentValue) {
      toast.warning('Please enter a domain or email before continuing');
      return;
    }
    
    if (scopeType === null) {
      toast.warning('Please select if you want to check email or website');
      return;
    }
    
    // Validar que el formato coincida con el tipo de scope seleccionado
    if (scopeType === 'email' && !isEmail(currentValue)) {
      toast.warning('Please enter a valid email address');
      return;
    }
    
    if (scopeType === 'website' && isEmail(currentValue)) {
      toast.warning('Please enter a domain, not an email address');
      return;
    }
    
    // Ejecutar el scan según el tipo seleccionado
    if (scopeType === 'email') {
      startEmailScan();
    } else if (scopeType === 'website') {
      startWebsiteScan();
    }
  };

  const handlePersonalEmailScan = () => {
    setScopeType('email');
    
    // Auto-completar con el email del usuario si no hay valor actual
    if (!emailValue) {
      const currentUser = user.get;
      
      // Intentar obtener email del usuario actual
      if (currentUser?.email) {
        setEmailValue(currentUser.email);
      } else {
        // Si no hay email en el usuario actual, verificar datos temporales del onboarding
        try {
          const tempOnboardingData = localStorage.getItem('onboarding_data');
          if (tempOnboardingData) {
            const tempData = JSON.parse(tempOnboardingData);
            if (tempData.user?.email) {
              setEmailValue(tempData.user.email);
            }
          }
        } catch (error) {
          console.warn('Error al obtener email de datos temporales:', error);
        }
      }
    }
  };

  const handleBusinessWebsiteScan = () => {
    // Solo cambiar el tipo de scope, NO auto-completar
    // El usuario puede escribir su propio dominio o dejarlo vacío
    setScopeType('website');
  };

  const startEmailScan = async () => {
    setLoading(true);
    update('resourceId', '');
    update('initialDomain', emailValue);
    update('scopeType', 'email');
    
    try {
      await goToStartScanStep();
      setLoading(false);
    } catch (error) {
      console.error('Error navigating to scan step:', error);
      toast.error('Failed to start email scan');
      setLoading(false);
    }
  };

  const startWebsiteScan = async () => {
    setLoading(true);
    update('resourceId', '');
    update('initialDomain', websiteValue);
    update('scopeType', 'website');
    
    try {
      await goToStartScanStep();
      setLoading(false);
    } catch (error) {
      console.error('Error navigating to scan step:', error);
      toast.error('Failed to start website scan');
      setLoading(false);
    }
  };

  return (
    <ModalWrapper showCloseBtn={true} type="welcome-modal-container" action={close}>
      <div className="welcome-content">
        <img className="logose" src="/codefend/logo-color.png" width={130} />
        <div className="welcome-header">
          <img src="/codefend/IA ICON.png" alt="AI Scanner" className="scanner-eye" />
          <p className="welcome-text">
            <b>Great! Let's start by performing an automated analysis of your attack surface.</b>{' '}
            We'll search for subdomains, analyze the main domain, look for data leaks and add
            resources.
          </p>
        </div>

        {/* Línea separadora antes de confirm scope */}
        <hr className="onboarding-separator" />

        <form className="input-container" onSubmit={changeInitialDomain}>
          <div className="scope-header">
            <label htmlFor="initialScope">
              <b>Confirm your initial scope</b>
            </label>
            
            {/* Botones de selección de tipo de scan - más pequeños y a la derecha */}
            <div className="scope-type-buttons-inline">
              <button
                type="button"
                className={`btn scope-btn-small ${scopeType === 'email' ? 'active' : ''}`}
                onClick={handlePersonalEmailScan}
                disabled={isLoading || loading}
              >
                Check my personal email
              </button>
              <button
                type="button"
                className={`btn scope-btn-small ${scopeType === 'website' ? 'active' : ''}`}
                onClick={handleBusinessWebsiteScan}
                disabled={isLoading || loading}
              >
                Check my business website
              </button>
            </div>
          </div>
          
          <input
            type="text"
            id="initialScope"
            name="initialScope"
            autoComplete="off"
            placeholder="Enter email or domain..."
            value={currentValue || ''}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button type="submit" className="btn btn-search" disabled={isLoading || loading}>
            <AimIcon />
          </button>
        </form>

        {/* Línea separadora después del input y antes de la tabla */}
        <hr className="onboarding-separator" />

        {/* Solo mostrar la tabla para websites, no para emails personales */}
        {scopeType !== 'email' && (
          <div className="limit-container">
            <Tablev3
              columns={columns}
              rows={domains}
              showRows={!!domains && !isLoading}
              limit={7}
              isNeedSort={false}
            />
          </div>
        )}

        {/* Mensaje informativo para emails personales */}
        {scopeType === 'email' && (
          <div className="email-scan-info">
            <p><b>Personal email scan ready</b></p>
            <p>We'll search for data leaks and security information related to your personal email address.</p>
          </div>
        )}
        <div className="btn-container">
          {/* <PrimaryButton text="Close assistant" buttonStyle="black" click={close} /> */}
          <button
            className="btn btn-add"
            type="button"
            onClick={nextStep}
            disabled={
              !Boolean(currentValue) || 
              isLoading || 
              loading || 
              scopeType === null ||
              (scopeType === 'website' && !Boolean(domains.length))
            }>
            Continue
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};
