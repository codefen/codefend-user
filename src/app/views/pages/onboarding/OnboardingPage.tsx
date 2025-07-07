/**
 * Página de Onboarding - Captura de Datos de Empresa
 * 
 * Este componente maneja el proceso de onboarding post-registro
 * donde se capturan los datos de empresa y se inicia el escaneo.
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
 * @version 1.0
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
    setIsPersonalUser(!isPersonalUser);
    setCompanyData(prev => ({
      ...prev,
      personal_user: !isPersonalUser ? '1' : '0'
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
      
      // Redirigir al dashboard después de completar onboarding
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar información de empresa');
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <div className="onboarding-header">
          <img src="/codefend/logo-color.png" alt="Codefend" />
          <h1>Great! Let's start by performing an automated analysis of your attack surface.</h1>
          <p>We'll search for subdomains, analyze the main domain, look for data leaks and add resources.</p>
        </div>

        {/* Paso 1: Datos de empresa */}
        {currentStep === 1 && (
          <form onSubmit={handleSubmit} className="onboarding-form">
            <div className="form-section">
              <h2>Confirm your initial scope</h2>
              
              {/* Toggle para usuario personal */}
              <div className="personal-user-toggle">
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    checked={isPersonalUser}
                    onChange={handlePersonalUserToggle}
                  />
                  <span className="toggle-slider"></span>
                                     <span className="toggle-label">I'm a personal user (no company)</span>
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
                </>
              )}

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

              <div className="form-info">
                <div className="info-item">
                  <span className="icon">🔍</span>
                  <div>
                    <strong>Automated analysis</strong>
                    <p>We'll automatically analyze your website for vulnerabilities</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">🛡️</span>
                  <div>
                    <strong>Continuous protection</strong>
                    <p>24/7 monitoring of your digital infrastructure</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="icon">👥</span>
                  <div>
                    <strong>Expert team</strong>
                    <p>Access to our team of cybersecurity specialists</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary onboarding-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 