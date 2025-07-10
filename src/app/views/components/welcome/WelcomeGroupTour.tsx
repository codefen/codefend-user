import { useEffect, useState } from 'react';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { useSolvedComunique } from '@panelHooks/comunique/useSolvedComunique';
import { WelcomeDomain } from '@/app/views/components/welcome/WelcomeDomain/WelcomeDomain';
import WelcomeScan from '@/app/views/components/welcome/WelcomeScan/WelcomeScan';
import { WelcomeFinish } from '@/app/views/components/welcome/WelcomeFinish/WelcomeFinish';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useAutoScan } from '@moduleHooks/newscanner/useAutoScan';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import { useNewVerifyScanList } from '@moduleHooks/newscanner/useNewVerifyScanList';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

// Variable global para bloquear llamadas incorrectas
let SCANNER_STARTING = false;

// Hacer la variable accesible globalmente para debug
(window as any).SCANNER_STARTING = () => SCANNER_STARTING;
(window as any).setScannerStarting = (value: boolean) => { SCANNER_STARTING = value; };

export const WelcomeGroupTour = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();
  const { solvedComunique } = useSolvedComunique();
  const { autoScan } = useAutoScan();
  const { initialDomain, scopeType } = useInitialDomainStore();
  const { mutate: mutateNewVerifyScanList } = useNewVerifyScanList();
  const { lastScanId } = useGlobalFastFields(['lastScanId']);
  
  // Estado para trackear si viene del onboarding
  const [comesFromOnboarding, setComesFromOnboarding] = useState(false);

  // Auto-abrir scanner después del onboarding
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('open_scanner') === 'true') {
      // Marcar que viene del onboarding
      setComesFromOnboarding(true);
      
      // 🚨 BANDERA CRÍTICA: Verificar checkEmail antes de abrir modal
      const { checkEmail } = useInitialDomainStore.getState();
      
      // EXCEPCIÓN: NO abrir automáticamente el modal si checkEmail es true
      // porque el usuario ya eligió ir directamente a SNS
      if (!checkEmail) {
        // Abrir automáticamente el scanner solo para scans de website
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
      } else {
        console.log('📧 checkEmail activo - no abrir modal automáticamente, usuario fue a SNS');
      }
      
      // Limpiar el parámetro URL
      const newURL = window.location.pathname;
      window.history.replaceState({}, document.title, newURL);
    }
  }, [setIsOpen, setModalId]);

  const startWaitStep = (idiom: string = 'en', domainParam?: string) => {
    // CRÍTICO: Usar dominio pasado como parámetro o fallback al store
    const domainToScan = domainParam || initialDomain;
    const currentScopeType = scopeType || 'website';
    
    // 🔍 DEBUGGING: Verificar valores recibidos
    console.log('🚀 startWaitStep - Iniciando scanner con valores:', {
      domainParam,
      domainToScan,
      currentScopeType,
      usedFromParam: !!domainParam,
      storeCompleto: useInitialDomainStore.getState()
    });
    
    // ✅ VALIDACIÓN: Si llegamos aquí, el dominio ya fue validado por web/preview
    // Solo verificamos que el valor esté presente
    if (!domainToScan) {
      console.error('❌ ERROR: No hay dominio disponible', {
        domainParam,
        storeState: useInitialDomainStore.getState()
      });
      throw new Error('No domain found - neither from parameter nor store');
    }
    
    console.log('🔄 Ejecutando autoScan con dominio verificado:', domainToScan);
    
    // CRÍTICO: Primero ejecutar autoScan y SOLO si es exitoso marcar onboarding como resuelto
    return autoScan(domainToScan, false, idiom, currentScopeType)
      .then((autoScanResult) => {
        console.log('📊 Resultado de autoScan:', autoScanResult);
        
        // Verificar si autoScan fue exitoso y obtuvo un ID
        if (autoScanResult?.neuroscan?.id) {
          console.log('✅ autoScan exitoso con ID:', autoScanResult.neuroscan.id);
          
          // CRÍTICO: Desactivar protección INMEDIATAMENTE para permitir polling
          SCANNER_STARTING = false;
          (window as any).setScannerStarting(false);
          console.log('🔄 SCANNER_STARTING = false - Permitiendo polling de progreso');
          
          // FORZAR REVALIDACIÓN INMEDIATA: Activar polling ahora que el neuroscan existe
          // Esto es crítico porque sin esto, el WelcomeFinish no recibirá datos actualizados
          setTimeout(() => {
            console.log('🔄 Forzando revalidación de hooks de polling...');
            // Trigger manual de revalidación usando mutate específico
            mutateNewVerifyScanList();
          }, 100);
          
          // SOLO AHORA marcar el onboarding como resuelto
          solvedComunique();
          console.log('✅ Onboarding marcado como resuelto después de inicializar scanner');
          
          return autoScanResult;
        } else {
          console.log('❌ autoScan falló - no se obtuvo ID:', autoScanResult);
          // Desactivar flag en caso de error también
          SCANNER_STARTING = false;
          (window as any).setScannerStarting(false);
          throw new Error('No se pudo inicializar el scanner');
        }
      })
      .catch((error) => {
        console.error('❌ Error al iniciar scanner:', error);
        // Desactivar flag global en caso de error también (si no se desactivó antes)
        SCANNER_STARTING = false;
        (window as any).setScannerStarting(false);
        console.log('🔄 SCANNER_STARTING = false (por error)');
        throw error; // Re-lanzar el error para que se maneje apropiadamente
      });
  };

  const goToStartScanStep = async (domainParam?: string) => {
    // CRÍTICO: Activar flag global para bloquear llamadas incorrectas
    SCANNER_STARTING = true;
    (window as any).setScannerStarting(true);
    console.log('🚀 goToStartScanStep - SCANNER_STARTING = true');
    
    // 🔍 DEBUGGING: Verificar dominio recibido
    console.log('🔍 goToStartScanStep - Dominio recibido:', domainParam);
    
    // Cambiar el estado del modal INMEDIATAMENTE para bloquear otros hooks
    console.log('🚀 goToStartScanStep - Cambiando modal a WELCOME_FINISH');
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
    
    // Ahora ejecutar el scanner con el dominio pasado como parámetro
    return startWaitStep('en', domainParam);
  };

  const close = () => {
    setIsOpen(false);
    setModalId('');
    solvedComunique();
    
    // 🚨 BANDERA CRÍTICA: Verificar checkEmail antes de redirigir
    const { checkEmail } = useInitialDomainStore.getState();
    
    // Si viene del onboarding, navegar directamente a issues con el scan específico
    // EXCEPCIÓN: No redirigir automáticamente si checkEmail es true (usuario seleccionó "check my personal email")
    if (comesFromOnboarding && !checkEmail) {
      console.log('🚀 Redirigiendo a issues - checkEmail:', checkEmail);
      // Pequeño delay para asegurar que el modal se haya cerrado
      setTimeout(() => {
        const scanId = lastScanId.get;
        if (scanId) {
          window.location.href = `/issues?scan_id=${scanId}`;
        } else {
          window.location.href = '/issues';
        }
      }, 100);
    } else if (checkEmail) {
      console.log('🎯 NO redirigiendo a issues - checkEmail activo:', checkEmail);
    }
  };

  if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_DOMAIN) {
    return <WelcomeDomain close={close} goToStartScanStep={goToStartScanStep} />;
  }
  else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_SCAN) {
    return <WelcomeScan goToWaitStep={startWaitStep} close={close} />;
  }
  else if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH) {
    return <WelcomeFinish solved={close} comesFromOnboarding={comesFromOnboarding} />;
  }
  return null;
};
