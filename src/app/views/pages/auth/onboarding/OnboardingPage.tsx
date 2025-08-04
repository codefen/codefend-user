/**
 * Página de Onboarding - Captura de Datos de Empresa
 *
 * Este componente maneja el proceso de onboarding post-registro
 * donde se capturan los datos de empresa y se inicia el escaneo.
 *
 * Diseño actualizado para coincidir con WelcomeDomain modal.
 *
 * Flujo:
 * 1. Captura datos de empresa (nombre, website, tamaño)
 * 2. Valida el dominio empresarial
 * 3. Actualiza los datos via Fase 4 del backend
 * 4. Inicia escaneo automático del dominio
 * 5. Redirige al dashboard
 *
 * Backend integration:
 * - POST /users/new?phase=4 (actualizar empresa)
 *
 * @author Codefend Team
 * @version 2.0
 */

import {
  useState,
  useEffect,
  useRef,
  type FormEvent,
  type ChangeEvent,
  type RefObject,
} from 'react';
import { toast } from '@/app/data/utils';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation, isValidDomain, isNotEmail } from '@/app/constants/validations';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { useGoogleAuth } from '@/app/data/hooks/users/auth/useGoogleAuth';
import { useSessionManager } from '@/app/data/hooks/users/auth/useSessionManager';
import { companySizesList } from '@mocks/defaultData';
import { AuthInput } from '@/app/views/pages/auth/newRegister/AuthInput/AuthInput';
import SelectField from '@/app/views/components/SelectField/SelectField';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { useInitialDomainStore } from '@/app/data/store/initialDomain.store';
import ModalWrapper from '@/app/views/components/modals/modalwrapper/ModalWrapper';
import './OnboardingPage.scss';
import { useTheme } from '@/app/views/context/ThemeContext';

export const OnboardingPage = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_web: '',
    company_size: '',
    personal_user: '0',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isPersonalUser, setIsPersonalUser] = useState(false);
  const [lastToastMessage, setLastToastMessage] = useState<string>(''); // Para evitar toasts duplicados

  // Referencias para hacer focus en los campos
  const companyWebRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const companySizeRef = useRef<HTMLSelectElement>(null);

  const { updateCompanyInfo } = useGoogleAuth();
  const { handleSuccessfulLogin } = useSessionManager();
  const { session, user } = useGlobalFastFields(['session', 'user']);
  const { update: updateInitialDomain } = useInitialDomainStore();
  const { theme } = useTheme();

  const handleClose = () => {
    // Opcional: agregar lógica de confirmación antes de cerrar
    window.location.href = '/';
  };

  // Función para mostrar toast único y hacer focus en el campo
  const showUniqueToast = (
    message: string,
    type: 'error' | 'warn' = 'error',
    fieldRef?: RefObject<HTMLInputElement | HTMLSelectElement | null>
  ) => {
    // Evitar mostrar el mismo toast repetidamente
    if (lastToastMessage === message) return;

    setLastToastMessage(message);

    // Mostrar toast
    if (type === 'error') {
      toast.error(message);
    } else {
      toast.warn(message);
    }

    // Hacer focus y scroll al campo problemático
    if (fieldRef?.current) {
      fieldRef.current.focus();

      // Scroll suave al campo
      fieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }

    // Limpiar el último mensaje después de un tiempo
    setTimeout(() => {
      setLastToastMessage('');
    }, 3000);
  };

  useEffect(() => {
    // NUEVO: Verificar si hay datos temporales de registro
    const tempOnboardingData = localStorage.getItem('onboarding_data');
    const tempSessionData = localStorage.getItem('temp_session_data');

    if (tempOnboardingData && tempSessionData) {
      // Caso 1: Usuario recién registrado con datos temporales
      // console.log('🚀 Onboarding con datos temporales de registro');
      try {
        const tempData = JSON.parse(tempOnboardingData);
        const sessionData = JSON.parse(tempSessionData);

        // Pre-llenar datos del usuario temporal
        if (
          tempData.user &&
          tempData.user.company_name &&
          tempData.user.company_name !== 'pending'
        ) {
          setCompanyData(prev => ({
            ...prev,
            company_name: tempData.user.company_name,
          }));
        }
      } catch (error) {
        console.error('Error al parsear datos temporales:', error);
      }
      return;
    }

    // Caso 2: Usuario con sesión activa
    const currentSession = session.get;
    const currentUser = user.get;

    if (!currentSession || !currentUser) {
      // Si no hay sesión NI datos temporales, redirigir al login
      // console.log('❌ No hay sesión ni datos temporales, redirigiendo al login');
      window.location.href = '/auth/signin';
      return;
    }

    // Pre-llenar datos si están disponibles
    if (currentUser.company_name && currentUser.company_name !== 'pending') {
      setCompanyData(prev => ({
        ...prev,
        company_name: currentUser.company_name,
      }));
    }
  }, []);

  // --- Funciones para normalizar URL (copiadas de ScanSection) ---
  const limpiarDominio = (url: string): string => {
    try {
      if (!/^https?:\/\//i.test(url) && !/^ftp:\/\//i.test(url)) {
        url = 'http://' + url;
      }
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const quitarProtocoloYWWW = (url: string): string => {
    return url.replace(/^(https?:\/\/|ftp:\/\/)?(www\.)?/i, '');
  };

  const quitarRuta = (url: string): string => {
    return url.split('/')[0].split('?')[0];
  };

  const normalizarURL = (url: string): string => {
    if (!url || url.trim() === '') return url;

    // Aplicar normalización paso a paso
    const sinProtocolo = quitarProtocoloYWWW(url);
    const sinRuta = quitarRuta(sinProtocolo);
    const limpio = limpiarDominio(sinRuta);

    return limpio;
  };

  const handlePersonalUserToggle = () => {
    const newIsPersonal = !isPersonalUser;
    setIsPersonalUser(newIsPersonal);
    setCompanyData(prev => ({
      ...prev,
      personal_user: newIsPersonal ? '1' : '0',
      // Si es usuario personal, establecer valores automáticos y limpiar campos no necesarios
      company_size: newIsPersonal ? '1-10' : prev.company_size,
      company_web: newIsPersonal ? '' : prev.company_web,
      company_name: newIsPersonal ? 'Personal Business' : prev.company_name,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    // Normalizar URL si es el campo company_web
    let processedValue = value;
    if (field === 'company_web' && value && value.trim() !== '') {
      processedValue = normalizarURL(value);
    }

    setCompanyData(prev => ({
      ...prev,
      [field]: processedValue,
    }));

    // Limpiar el último mensaje de toast cuando el usuario empiece a escribir
    if (lastToastMessage) {
      setLastToastMessage('');
    }

    // Auto-generar nombre de empresa basado en dominio si es válido (sin mostrar toasts)
    if (
      field === 'company_web' &&
      processedValue &&
      !isPersonalUser &&
      isValidDomain(processedValue)
    ) {
      const cleanDomain = processedValue.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
      const companyName = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
      setCompanyData(prev => ({
        ...prev,
        company_name: companyName,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar campos requeridos para usuarios empresariales
    if (!isPersonalUser) {
      // Validar dominio empresarial
      if (!companyData.company_web || companyData.company_web.trim() === '') {
        showUniqueToast('Please enter your company domain', 'error', companyWebRef);
        return;
      }

      // Verificar que no sea un email
      if (!isNotEmail(companyData.company_web)) {
        showUniqueToast(AUTH_TEXT.DOMAIN_NOT_EMAIL, 'error', companyWebRef);
        return;
      }

      // Verificar que sea un dominio válido
      if (!isValidDomain(companyData.company_web)) {
        showUniqueToast(AUTH_TEXT.INVALID_DOMAIN, 'error', companyWebRef);
        return;
      }

      // Validar nombre de empresa
      if (!companyData.company_name || companyData.company_name.trim() === '') {
        showUniqueToast('Please enter your company name', 'error', companyNameRef);
        return;
      }

      // Validar tamaño de empresa
      if (!companyData.company_size || companyData.company_size.trim() === '') {
        showUniqueToast('Please select your company size', 'error', companySizeRef);
        return;
      }
    }
    // Para usuarios personales no hay validaciones adicionales ya que se generan automáticamente

    // NUEVO: Verificar si estamos usando datos temporales
    const tempOnboardingData = localStorage.getItem('onboarding_data');
    const tempSessionData = localStorage.getItem('temp_session_data');

    let sessionToUse: string | null = null;
    let userToUse: any = null;

    if (tempOnboardingData && tempSessionData) {
      // Caso 1: Usuario recién registrado con datos temporales
      try {
        const tempData = JSON.parse(tempOnboardingData);
        const sessionData = JSON.parse(tempSessionData);

        sessionToUse = sessionData.session;
        userToUse = tempData.user;

        // console.log('🚀 Usando datos temporales para onboarding');
      } catch (error) {
        console.error('Error al parsear datos temporales:', error);
        toast.error('Error al procesar datos temporales. Por favor, inicia sesión nuevamente.');
        window.location.href = '/auth/signin';
        return;
      }
    } else {
      // Caso 2: Usuario con sesión activa
      const currentSession = session.get;
      const currentUser = user.get;

      if (!currentSession || !currentUser) {
        toast.error('Sesión no válida. Por favor, inicia sesión nuevamente.');
        window.location.href = '/auth/signin';
        return;
      }

      sessionToUse = currentSession;
      userToUse = currentUser;
    }

    try {
      // Preparar datos para envío (aplicar normalización final a la URL)
      const normalizedCompanyData = {
        ...companyData,
        company_web:
          companyData.company_web && companyData.company_web !== '-'
            ? normalizarURL(companyData.company_web)
            : companyData.company_web,
      };

      const submitData = {
        model: 'users/new',
        phase: '4',
        user_id: userToUse.id,
        session: sessionToUse,
        ...normalizedCompanyData,
      };

      // Enviar datos al backend
      const { data } = await fetcher('post', {
        body: submitData,
        requireSession: false,
      });

      if (apiErrorValidation(data)) {
        throw new Error((data as any)?.info || 'Error al actualizar información de empresa');
      }

      toast.success('Business information updated!');

      // NUEVO: Guardar dominio de la empresa en el store SOLO para usuarios empresariales
      if (
        !isPersonalUser &&
        normalizedCompanyData.company_web &&
        normalizedCompanyData.company_web !== '-' &&
        normalizedCompanyData.company_web !== 'pending-onboarding.temp'
      ) {
        updateInitialDomain('initialDomain', normalizedCompanyData.company_web);
        updateInitialDomain('scopeType', 'website');
        // console.log(
        //   '🔗 Dominio normalizado guardado para el scanner:',
        //   normalizedCompanyData.company_web
        // );
      } else if (isPersonalUser) {
        // Para usuarios personales, limpiar el store y configurar para email
        updateInitialDomain('initialDomain', '');
        updateInitialDomain('scopeType', 'email');
        // console.log('🧹 Usuario personal - Store limpiado y configurado para email');
      }

      // Limpiar datos temporales
      localStorage.removeItem('onboarding_data');
      localStorage.removeItem('temp_session_data');

      // Si era usuario temporal, ahora hacer login real
      if (tempOnboardingData && tempSessionData) {
        try {
          const tempData = JSON.parse(tempOnboardingData);
          handleSuccessfulLogin(tempData, false); // false = no mostrar toast de login
          // console.log('✅ Login completado después de onboarding');
        } catch (error) {
          console.error('Error al hacer login después de onboarding:', error);
        }
      }

      // Redirigir al dashboard y abrir automáticamente el scanner
      setTimeout(() => {
        window.location.href = '/?open_scanner=true';
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar información de empresa');
    }
  };

  return (
    <ModalWrapper showCloseBtn={false} type="onboarding-modal-container" action={handleClose}>
      <div className="new-auth-content readonly-content">
        <h1>
          Unveil the full attack surface...
          <br />
          <span>discover real threats</span>
        </h1>

        <p className="header-text">
          Start with a one domain or email. Codefend uncovers what’s leaking, exposed or exploitable
          — before attackers do. Browse and scan across thousands of systems and millions of
          breached identities indexed. We are experts in blackbox operations.
        </p>

        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">
              <img src="/codefend/Grupo-1.png" alt="Professional hackers" />
            </div>
            <div className="feature-content">
              <h3>Professional hackers on demand</h3>
              <p>
                Hire professional hackers on demand, when you need them! Our professionals follow
                the same paths real attackers do.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src="/codefend/icono-leaks.png" alt="Database explorer" />
            </div>
            <div className="feature-content">
              <h3>Full dataleaks explorer</h3>
              <p>
                See what parts of your tech stack have already been leaked. Correlate your users
                with 190B+ breached records and discover hidden threats.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <img src="/codefend/icono-bicho.png" alt="Attack surface map" />
            </div>
            <div className="feature-content">
              <h3>Automated attack surface map</h3>
              <p>
                Visualize the online exposure like never before. From one domain to your full
                infrastructure — unveil hosts, techs, live vulnerabilities and people and more.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="new-auth-content welcome-content">
        <img className="logose" src={`/codefend/brand-small-${theme}.png`} width={220} />

        <div className="onboarding-header">
          <b>Business information</b>
          <p>
            If you have a company, tell us a bit about it — it helps us give you a better service.
          </p>
          <p>No company? No problem! You can still use Codefend as a personal user.</p>
        </div>

        {/* Línea separadora estilizada */}
        <hr className="onboarding-separator" />

        {/* Paso 1: Datos de empresa */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="form-section">
              <div className="input-container">
                {/* Toggle para usuario personal */}
                <div className="personal-user-toggle">
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={isPersonalUser}
                      onChange={handlePersonalUserToggle}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">I'm a personal user</span>
                  </label>
                  {isPersonalUser && (
                    <p className="personal-user-note">
                      Perfect! We'll set up a personal account for you automatically.
                    </p>
                  )}
                </div>

                {!isPersonalUser && (
                  <>
                    <AuthInput
                      placeholder="Enter domain to attack"
                      value={companyData.company_web}
                      setVal={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('company_web', e.target.value)
                      }
                      required
                      autoComplete="url"
                      ref={companyWebRef}
                    />

                    <AuthInput
                      placeholder="Company name"
                      value={companyData.company_name}
                      setVal={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('company_name', e.target.value)
                      }
                      required
                      autoComplete="organization"
                      ref={companyNameRef}
                    />

                    <SelectField
                      name="company_size"
                      options={[
                        { value: '', label: 'Company size', hidden: true },
                        ...companySizesList.map(company => ({
                          value: company.value,
                          label: company.label,
                        })),
                      ]}
                      value={companyData.company_size}
                      onChange={e => handleInputChange('company_size', e.target.value)}
                      required
                      ref={companySizeRef}
                    />
                  </>
                )}
              </div>

              {/* Línea separadora antes del botón */}
              <hr className="onboarding-separator" />

              <div className="btn-container">
                <button type="submit" className="btn btn-red" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </ModalWrapper>
  );
};
