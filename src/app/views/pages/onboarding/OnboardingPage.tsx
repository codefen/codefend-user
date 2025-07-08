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

import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation } from '@/app/constants/validations';
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

export const OnboardingPage = () => {
  const [fetcher, _, isLoading] = useFetcher();
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_web: '',
    company_size: '',
    personal_user: '0'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isPersonalUser, setIsPersonalUser] = useState(false);
  
  const { updateCompanyInfo } = useGoogleAuth();
  const { handleSuccessfulLogin } = useSessionManager();
  const { session, user } = useGlobalFastFields(['session', 'user']);
  const { update: updateInitialDomain } = useInitialDomainStore();

  const handleClose = () => {
    // Opcional: agregar lógica de confirmación antes de cerrar
    window.location.href = '/';
  };

  useEffect(() => {
    // NUEVO: Verificar si hay datos temporales de registro
    const tempOnboardingData = localStorage.getItem('onboarding_data');
    const tempSessionData = localStorage.getItem('temp_session_data');
    
    if (tempOnboardingData && tempSessionData) {
      // Caso 1: Usuario recién registrado con datos temporales
      console.log('🚀 Onboarding con datos temporales de registro');
      try {
        const tempData = JSON.parse(tempOnboardingData);
        const sessionData = JSON.parse(tempSessionData);
        
        // Pre-llenar datos del usuario temporal
        if (tempData.user && tempData.user.company_name && tempData.user.company_name !== 'pending') {
          setCompanyData(prev => ({
            ...prev,
            company_name: tempData.user.company_name
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
      console.log('❌ No hay sesión ni datos temporales, redirigiendo al login');
      window.location.href = '/auth/signin';
      return;
    }
    
    // Pre-llenar datos si están disponibles
    if (currentUser.company_name && currentUser.company_name !== 'pending') {
      setCompanyData(prev => ({
        ...prev,
        company_name: currentUser.company_name
      }));
    }
  }, []);

  const handlePersonalUserToggle = () => {
    const newIsPersonal = !isPersonalUser;
    setIsPersonalUser(newIsPersonal);
    setCompanyData(prev => ({
      ...prev,
      personal_user: newIsPersonal ? '1' : '0',
      // Si es usuario personal, establecer automáticamente company_size como '1-10'
      company_size: newIsPersonal ? '1-10' : prev.company_size
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-generar nombre de empresa basado en dominio
    if (field === 'company_web' && value && !isPersonalUser) {
      const cleanDomain = value.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
      const companyName = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
      setCompanyData(prev => ({
        ...prev,
        company_name: companyName
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
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
        
        console.log('🚀 Usando datos temporales para onboarding');
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
      // Preparar datos para envío
      const submitData = {
        model: 'users/new',
        phase: '4',
        user_id: userToUse.id,
        session: sessionToUse,
        ...companyData
      };

      // Enviar datos al backend
      const { data } = await fetcher('post', {
        body: submitData,
        requireSession: false,
      });

      if (apiErrorValidation(data)) {
        throw new Error((data as any)?.info || 'Error al actualizar información de empresa');
      }

      toast.success('¡Información de empresa actualizada exitosamente!');
      
      // NUEVO: Guardar dominio de la empresa en el store para vincularlo con el scanner
      if (companyData.company_web && companyData.company_web !== '-' && companyData.company_web !== 'pending-onboarding.temp') {
        const cleanDomain = companyData.company_web.replace(/^(https?:\/\/)?(www\.)?/, '');
        updateInitialDomain('initialDomain', cleanDomain);
        console.log('🔗 Dominio guardado para el scanner:', cleanDomain);
      }
      
      // Limpiar datos temporales
      localStorage.removeItem('onboarding_data');
      localStorage.removeItem('temp_session_data');
      
      // Si era usuario temporal, ahora hacer login real
      if (tempOnboardingData && tempSessionData) {
        try {
          const tempData = JSON.parse(tempOnboardingData);
          handleSuccessfulLogin(tempData);
          console.log('✅ Login completado después de onboarding');
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
      <div className="welcome-content">
        <img className="logose" src="/codefend/logo-color.png" width={130} />
        
        <div className="onboarding-header">
          <b>Business information</b>
          <p>If you have a company, tell us a bit about it — it helps us give you a better service.</p>
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
                </div>

                {!isPersonalUser && (
                  <>
                    <AuthInput
                      placeholder="Enter your domain (e.g., yourcompany.com)"
                      value={companyData.company_web}
                      setVal={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('company_web', e.target.value)}
                      required
                      autoComplete="url"
                    />
                    
                    <AuthInput
                      placeholder="Company name"
                      value={companyData.company_name}
                      setVal={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('company_name', e.target.value)}
                      required
                      autoComplete="organization"
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
                      onChange={(e) => handleInputChange('company_size', e.target.value)}
                      required
                    />
                  </>
                )}

                {/* Solo mostrar company name si es usuario personal */}
                {isPersonalUser && (
                  <AuthInput
                    placeholder="Company name"
                    value={companyData.company_name}
                    setVal={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('company_name', e.target.value)}
                    required
                    autoComplete="organization"
                  />
                )}
              </div>

              {/* Línea separadora antes del botón */}
              <hr className="onboarding-separator" />

              <div className="btn-container">
                <button 
                  type="submit" 
                  className="btn btn-continue"
                  disabled={isLoading}
                >
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