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
      
      // EXCEPCIÓN: NO abrir automáticamente el modal si el scopeType es 'email'
      // porque el usuario ya eligió ir directamente a SNS
      if (scopeType !== 'email') {
        // Abrir automáticamente el scanner solo para scans de website
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.USER_WELCOME_DOMAIN);
      } else {
        console.log('📧 Scope es email - no abrir modal automáticamente, usuario fue a SNS');
      }
      
      // Limpiar el parámetro URL
      const newURL = window.location.pathname;
      window.history.replaceState({}, document.title, newURL);
    }
  }, [setIsOpen, setModalId, scopeType]);

  const startWaitStep = (idiom: string = 'en') => {
    // CRÍTICO: Usar datos ya obtenidos del hook para evitar error de hooks
    const domainToScan = initialDomain;
    const currentScopeType = scopeType || 'website';
    
    console.log('🚀 Iniciando scanner con dominio:', domainToScan, 'scope:', currentScopeType);
    
    // NO cambiar el modal aquí (ya se cambió en goToStartScanStep)
    // Ejecutar inmediatamente
    console.log('🔄 Ejecutando autoScan con:', domainToScan);
    
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

  const goToStartScanStep = async () => {
    // CRÍTICO: Activar flag global para bloquear llamadas incorrectas
    SCANNER_STARTING = true;
    (window as any).setScannerStarting(true);
    console.log('🚀 goToStartScanStep - SCANNER_STARTING = true');
    
    // Cambiar el estado del modal INMEDIATAMENTE para bloquear otros hooks
    console.log('🚀 goToStartScanStep - Cambiando modal a WELCOME_FINISH');
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
    
    // Ahora ejecutar el scanner
    return startWaitStep('en');
  };

  const close = () => {
    setIsOpen(false);
    setModalId('');
    solvedComunique();
    
    // Si viene del onboarding, navegar directamente a issues con el scan específico
    // EXCEPCIÓN: No redirigir automáticamente si el scopeType es 'email', porque ya se manejó en WelcomeDomain
    if (comesFromOnboarding && scopeType !== 'email') {
      // Pequeño delay para asegurar que el modal se haya cerrado
      setTimeout(() => {
        const scanId = lastScanId.get;
        if (scanId) {
          window.location.href = `/issues?scan_id=${scanId}`;
        } else {
          window.location.href = '/issues';
        }
      }, 100);
    }
    
    // Si es email, no hacer nada - la redirección ya se manejó en WelcomeDomain
    if (scopeType === 'email') {
      console.log('📧 Scope es email - no redirigir automáticamente, ya se manejó en WelcomeDomain');
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
