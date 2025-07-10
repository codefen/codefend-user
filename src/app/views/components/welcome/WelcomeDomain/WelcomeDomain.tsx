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
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    
    console.log('🔍 Verificando tipo de usuario:', { 
      user: currentUser, 
      company: currentCompany,
      personal_user: currentUser?.personal_user,
      company_web: currentCompany?.web 
    });
    
    // Método 1: Verificar si personal_user está marcado como '1'
    if (currentUser?.personal_user === '1' || currentUser?.personal_user === 1) {
      console.log('✅ Usuario personal detectado por personal_user flag');
      return true;
    }
    
    // Método 2: Verificar datos de empresa que indican usuario personal
    if (currentCompany?.name === 'Personal Business' || 
        currentCompany?.web === '-' ||
        (currentCompany?.size === '1-10' && currentCompany?.web === '-')) {
      console.log('✅ Usuario personal detectado por datos de empresa');
      return true;
    }
    
    // Método 3: Verificar datos temporales del onboarding
    try {
      const tempOnboardingData = localStorage.getItem('onboarding_data');
      if (tempOnboardingData) {
        const tempData = JSON.parse(tempOnboardingData);
        if (tempData.user?.personal_user === '1' || tempData.user?.personal_user === 1) {
          console.log('✅ Usuario personal detectado por datos temporales');
          return true;
        }
      }
    } catch (error) {
      console.warn('Error al verificar datos temporales:', error);
    }
    
    console.log('❌ Usuario NO es personal');
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
    
    console.log('🔄 Inicializando WelcomeDomain...');
    
    // Obtener datos disponibles
    const currentUser = user.get;
    const currentCompany = company.get;
    const userEmail = currentUser?.email;
    const companyWebsite = hasCompanyWebsite() ? currentCompany?.web : null;
    const isPersonal = isPersonalUser();
    
    console.log('📊 Datos disponibles:', { 
      userEmail, 
      companyWebsite, 
      isPersonal,
      company: currentCompany,
      user: currentUser 
    });
    
    // NUEVA LÓGICA: Determinar preselección basada en datos disponibles
    // Regla 1: Si tiene solo email => preseleccionar "check my personal email"
    // Regla 2: Si tiene dominio (con o sin email) => preseleccionar "check my business website"
    
    let shouldPreselect: 'email' | 'website' = 'email'; // Default fallback
    let shouldPopulateEmail = false;
    let shouldPopulateWebsite = false;
    
    if (initialDomainStored) {
      // Si hay valor en el store, usarlo para determinar el tipo
      console.log('📥 Valor desde store:', initialDomainStored);
      if (isEmail(initialDomainStored)) {
        shouldPreselect = 'email';
        setEmailValue(initialDomainStored);
      } else {
        shouldPreselect = 'website';
        setWebsiteValue(initialDomainStored);
      }
    } else {
      // Determinar basándose en los datos disponibles
      if (companyWebsite) {
        // TIENE DOMINIO: preseleccionar business website (independientemente de si tiene email)
        console.log('🏢 Tiene dominio de empresa - preseleccionando business website');
        shouldPreselect = 'website';
        shouldPopulateWebsite = true;
      } else if (userEmail) {
        // SOLO TIENE EMAIL: preseleccionar personal email
        console.log('📧 Solo tiene email - preseleccionando personal email');
        shouldPreselect = 'email';
        shouldPopulateEmail = true;
      } else if (isPersonal) {
        // USUARIO PERSONAL SIN DATOS: preseleccionar personal email
        console.log('👤 Usuario personal sin datos - preseleccionando personal email');
        shouldPreselect = 'email';
        shouldPopulateEmail = true;
      } else {
        // USUARIO EMPRESARIAL SIN DATOS: preseleccionar business website
        console.log('🏢 Usuario empresarial sin datos - preseleccionando business website');
        shouldPreselect = 'website';
      }
    }
    
    // Aplicar la preselección
    console.log(`🎯 Preseleccionando: ${shouldPreselect}`);
    
    // Limpiar store para evitar conflictos
    update('initialDomain', '');
    update('scopeType', shouldPreselect);
    
    // Establecer el scope type
    setScopeType(shouldPreselect);
    
    // Poblar campos según corresponda
    if (shouldPopulateEmail && userEmail) {
      setEmailValue(userEmail);
      console.log('✅ Email del usuario cargado:', userEmail);
    }
    
    if (shouldPopulateWebsite && companyWebsite) {
      setWebsiteValue(companyWebsite);
      console.log('✅ Website de empresa cargado:', companyWebsite);
    }
    
    // Limpiar el campo no utilizado
    if (shouldPreselect === 'email') {
      setWebsiteValue('');
    } else {
      setEmailValue('');
    }
    
    // Marcar como inicializado
    setHasInitialized(true);
    console.log('✅ WelcomeDomain inicializado con scope:', shouldPreselect);
  }, [hasInitialized, initialDomainStored]);

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
      // Redireccionar directamente a SNS con el email como parámetro
      const encodedEmail = encodeURIComponent(emailValue);
      const snsUrl = `/sns?keyword=${encodedEmail}&class=email`;
      
      console.log('🚀 Redirigiendo a SNS con email:', emailValue);
      console.log('🔗 URL de SNS:', snsUrl);
      
      // Cerrar el modal y navegar
      close();
      navigate(snsUrl);
      
      setLoading(false);
    } catch (error) {
      console.error('Error navigating to SNS:', error);
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


