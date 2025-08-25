import { useEffect, type PropsWithChildren, useRef, useMemo, useCallback } from 'react';
import createFastContext from './FastContextProvider';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import type { AuditData, KeyPress, LocationData, OwnerData } from '@interfaces/util';
import { EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE, MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { APP_EVENT_TYPE, AUTO_SCAN_STATE, USER_LOGGING_STATE } from '@interfaces/index';

export interface CompanyUser extends OwnerData, AuditData, LocationData {
  admin_user_email: string;
  admin_user_id: string;
  admin_user_username: string;
  class: string;
  disponibles_issues_view: string;
  disponibles_neuroscan: string;
  disponibles_sns: string;
  mercado: string;
  name: string;
  orders_size: string;
  plan: string;
  profile_media: string;
  reseller_id: string;
  reseller_name: string;
  reseller_revenue_share: string;
  size: string;
  sub_class: string;
  web: string;
  address: string;
}

export interface UserLead {
  lead_fname?: string;
  lead_lname?: string;
  lead_email?: string;
  lead_phone?: string;
  company_name?: string;
  company_web?: string;
  company_size?: string;
  idiom?: string;
}

export type GlobalStore = {
  isOpenNetworkSetting: boolean;
  country: string;
  city: string;
  region: string;
  openModal: boolean;
  resourceType: RESOURCE_CLASS;
  resourceID: string;
  company: CompanyUser;
  keyPress: KeyPress;
  lead: UserLead;

  scanProgress: number;
  subdomainProgress: number;
  webScanProgress: number;
  leaksScanProgress: number;

  domainCount: number;
  subDomainCount: number;
  uniqueIpCount: number;
  internalIpCount: number;
  externalIpCount: number;
  subNetworkCount: number;
  planPreference: 'small' | 'medium' | 'advanced';
  mobilePlanPreference: 'small' | 'medium' | 'advanced';
  isDefaultPlan: boolean;
  isProgressStarted: boolean;
  selectedApp: any;
  currentScan: any;
  isScanning: boolean;
  selectedTicket: any;
  session: string;
  scanNumber: number;
  user: any;
  companies: any[];
  scanRetries: number;
  webResourceSelected: any;
  appEvent: APP_EVENT_TYPE;
  totalNotUniqueIpCount: number;
  totalNetowrkElements: number;
  userLoggingState: USER_LOGGING_STATE;
  networkResourceSelected: any;
  autoScanState: AUTO_SCAN_STATE;
  scaningProgress: any;
  lastScanId: string;
  scanVersion: number;
  subscriptionSelected: any;
};

const persistedStateJSON = localStorage.getItem('globalStore');
const persistedState = persistedStateJSON ? JSON.parse(persistedStateJSON) : {};

export const initialGlobalState: GlobalStore = {
  isOpenNetworkSetting:
    persistedState?.isOpenNetworkSetting ?? EMPTY_GLOBAL_STATE.isOpenNetworkSetting,
  openModal: persistedState?.openModal ?? EMPTY_GLOBAL_STATE.openModal,
  country: persistedState?.country ?? EMPTY_GLOBAL_STATE.country,
  city: persistedState?.city ?? EMPTY_GLOBAL_STATE.city,
  region: persistedState?.region ?? EMPTY_GLOBAL_STATE.region,
  resourceType: persistedState?.resourceType ?? RESOURCE_CLASS.WEB,
  resourceID: persistedState?.resourceID ?? EMPTY_GLOBAL_STATE.resourceID,
  company: persistedState?.company ?? EMPTY_COMPANY_CUSTOM,
  keyPress: persistedState?.keyPress ?? EMPTY_GLOBAL_STATE.keyPress,
  lead: persistedState?.lead ?? EMPTY_GLOBAL_STATE.lead,
  domainCount: persistedState?.domainCount ?? EMPTY_GLOBAL_STATE.domainCount,
  subDomainCount: persistedState?.subDomainCount ?? EMPTY_GLOBAL_STATE.subDomainCount,
  uniqueIpCount: persistedState?.uniqueIpCount ?? EMPTY_GLOBAL_STATE.uniqueIpCount,
  planPreference: persistedState?.planPreference ?? EMPTY_GLOBAL_STATE.planPreference,
  isDefaultPlan: persistedState?.isDefaultPlan ?? EMPTY_GLOBAL_STATE.isDefaultPlan,
  selectedApp: persistedState?.selectedApp ?? EMPTY_GLOBAL_STATE.selectedApp,
  mobilePlanPreference:
    persistedState?.mobilePlanPreference ?? EMPTY_GLOBAL_STATE.mobilePlanPreference,

  scanProgress: persistedState?.scanProgress ?? EMPTY_GLOBAL_STATE.scanProgress,
  subdomainProgress: persistedState?.subdomainProgress ?? EMPTY_GLOBAL_STATE.subdomainProgress,
  webScanProgress: persistedState?.webScanProgress ?? EMPTY_GLOBAL_STATE.webScanProgress,
  leaksScanProgress: persistedState?.leaksScanProgress ?? EMPTY_GLOBAL_STATE.leaksScanProgress,

  isProgressStarted: persistedState?.isProgressStarted ?? EMPTY_GLOBAL_STATE.isProgressStarted,
  currentScan: persistedState?.currentScan ?? EMPTY_GLOBAL_STATE.currentScan,
  isScanning: persistedState?.isScanning ?? EMPTY_GLOBAL_STATE.isScanning,
  selectedTicket: persistedState?.selectedTicket ?? EMPTY_GLOBAL_STATE.selectedTicket,
  session: persistedState?.session ?? EMPTY_GLOBAL_STATE.session,
  scanNumber: persistedState?.scanNumber ?? EMPTY_GLOBAL_STATE.scanNumber,
  user: persistedState?.user ?? null,
  companies: persistedState?.companies ?? EMPTY_GLOBAL_STATE.companies,
  scanRetries: persistedState?.scanRetries ?? MAX_SCAN_RETRIES,
  internalIpCount: persistedState?.internalIpCount ?? EMPTY_GLOBAL_STATE.internalIpCount,
  externalIpCount: persistedState?.externalIpCount ?? EMPTY_GLOBAL_STATE.externalIpCount,
  totalNotUniqueIpCount:
    persistedState?.totalNotUniqueIpCount ?? EMPTY_GLOBAL_STATE.totalNotUniqueIpCount,
  subNetworkCount: persistedState?.subNetworkCount ?? EMPTY_GLOBAL_STATE.subNetworkCount,
  webResourceSelected:
    persistedState?.webResourceSelected ?? EMPTY_GLOBAL_STATE.webResourceSelected,
  appEvent: persistedState?.appEvent ?? APP_EVENT_TYPE.NOTIFICATION,
  totalNetowrkElements:
    persistedState?.totalNetowrkElements ?? EMPTY_GLOBAL_STATE.totalNetowrkElements,
  userLoggingState: persistedState?.userLoggingState ?? EMPTY_GLOBAL_STATE.userLoggingState,
  networkResourceSelected:
    persistedState?.networkResourceSelected ?? EMPTY_GLOBAL_STATE.networkResourceSelected,
  autoScanState: persistedState?.autoScanState ?? EMPTY_GLOBAL_STATE.autoScanState,
  scaningProgress: persistedState?.scaningProgress ?? EMPTY_GLOBAL_STATE.scaningProgress,
  lastScanId: persistedState?.lastScanId ?? EMPTY_GLOBAL_STATE.lastScanId,
  scanVersion: persistedState?.scanVersion ?? EMPTY_GLOBAL_STATE.scanVersion,
  subscriptionSelected:
    persistedState?.subscriptionSelected ?? EMPTY_GLOBAL_STATE.subscriptionSelected,
};

const {
  FastContextProvider: GlobalStoreContextProvider,
  useFastField: useGlobalFastField,
  useFastContextFields: useGlobalFastFields,
  useResetStore: useResetGlobalStore,
} = createFastContext<GlobalStore>(initialGlobalState);

const GlobalStorePersistor = () => {
  const keys = Object.keys(initialGlobalState) as (keyof GlobalStore)[];
  const store = useGlobalFastFields(keys);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSerializedRef = useRef<string>('');

  const currentValues = useMemo(
    () =>
      keys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: store[key].get,
        }),
        {} as GlobalStore
      ),
    [keys.map(key => store[key].get)]
  );

  // Función utility para limpiar localStorage de forma segura
  const cleanupLocalStorage = useCallback(() => {
    try {
      console.log('🧹 Cleaning up localStorage due to storage issues');
      const keysToRemove = ['globalStore', 'temp_session_data', 'temp_onboarding_data'];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Mantener solo configuraciones del usuario si existen
      const userPrefs = localStorage.getItem('user_preferences');
      localStorage.clear();
      if (userPrefs) {
        localStorage.setItem('user_preferences', userPrefs);
      }
    } catch (error) {
      console.error('Error during localStorage cleanup:', error);
    }
  }, []);

  useEffect(() => {
    const persistState = () => {
      try {
        const serialized = JSON.stringify(currentValues);
        // Solo escribir si el contenido cambió
        if (serialized !== lastSerializedRef.current) {
          // Verificar si el tamaño es razonable antes de guardar
          if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
            console.warn('GlobalStore data too large, clearing localStorage');
            localStorage.clear();
            return;
          }
          
          localStorage.setItem('globalStore', serialized);
          lastSerializedRef.current = serialized;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, performing cleanup');
          cleanupLocalStorage();
          // Intentar guardar solo los datos esenciales
          try {
            const essentialData = {
              session: currentValues.session,
              user: currentValues.user,
              company: currentValues.company,
            };
            localStorage.setItem('globalStore', JSON.stringify(essentialData));
            lastSerializedRef.current = JSON.stringify(essentialData);
          } catch (retryError) {
            console.error('Failed to save essential data after cleanup:', retryError);
          }
        } else {
          console.warn('Error saving to localStorage:', error);
        }
      }
    };

    // Persist immediately on login event
    if (currentValues.appEvent === APP_EVENT_TYPE.USER_LOGGED_IN && currentValues.session) {
      // console.log('💾 GlobalStorePersistor: Immediate persistence triggered by login event', {
      //   sessionPresent: !!currentValues.session,
      //   userId: currentValues.user?.id,
      // });
      persistState();
      // console.log('✅ GlobalStorePersistor: Login state persisted to localStorage');
      return;
    }

    // Debounce localStorage writes para reducir I/O en otros casos
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(persistState, 100); // Debounce de 100ms

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [currentValues]);

  return null;
};

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <GlobalStoreContextProvider>
      <GlobalStorePersistor />
      {children}
    </GlobalStoreContextProvider>
  );
};

export { GlobalStoreProvider, useGlobalFastField, useGlobalFastFields };
