import { useEffect, useState, type PropsWithChildren } from 'react';
import createFastContext from './FastContextProvider';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import type { AuditData, KeyPress, LocationData, OwnerData } from '@interfaces/util';
import { EMPTY_COMPANY_CUSTOM, EMPTY_GLOBAL_STATE, MAX_SCAN_RETRIES } from '@/app/constants/empty';
import { APP_EVENT_TYPE } from '@interfaces/index';

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
  activeScan: any;
  isScanning: boolean;
  selectedTicket: any;
  session: string;
  scanNumber: number;
  user: any;
  companies: any[];
  scanRetries: number;
  webResourceSelected: any;
  appEvent: APP_EVENT_TYPE;
  isInitialFetchDone: boolean;
  totalNotUniqueIpCount: number;
};

const persistedStateJSON = localStorage.getItem('globalStore');
const persistedState = persistedStateJSON ? JSON.parse(persistedStateJSON) : {};

export const initialGlobalState: GlobalStore = {
  isOpenNetworkSetting: persistedState?.isOpenNetworkSetting ?? false,
  openModal: persistedState?.openModal ?? false,
  country: persistedState?.country ?? '',
  city: persistedState?.city ?? '',
  region: persistedState?.region ?? '',
  resourceType: persistedState?.resourceType ?? RESOURCE_CLASS.WEB,
  resourceID: persistedState?.resourceID ?? '',
  company: persistedState?.company ?? EMPTY_COMPANY_CUSTOM,
  keyPress: persistedState?.keyPress ?? '',
  lead: persistedState?.lead ?? {},
  domainCount: persistedState?.domainCount ?? 0,
  subDomainCount: persistedState?.subDomainCount ?? 0,
  uniqueIpCount: persistedState?.uniqueIpCount ?? 0,
  planPreference: persistedState?.planPreference ?? 'medium',
  isDefaultPlan: persistedState?.isDefaultPlan,
  selectedApp: persistedState?.selectedApp ?? null,
  mobilePlanPreference: persistedState?.mobilePlanPreference ?? 'medium',

  scanProgress: persistedState?.scanProgress ?? 0,
  isProgressStarted: persistedState?.isProgressStarted,
  currentScan: persistedState?.currentScan ?? null,
  isScanning: persistedState?.isScanning,
  selectedTicket: persistedState?.selectedTicket ?? null,
  session: persistedState?.session ?? '',
  scanNumber: persistedState?.scanNumber ?? 0,
  user: persistedState?.user ?? null,
  companies: persistedState?.companies ?? [],
  scanRetries: persistedState?.scanRetries ?? MAX_SCAN_RETRIES,
  activeScan: persistedState?.activeScan ?? null,
  internalIpCount: persistedState?.internalIpCount ?? 0,
  externalIpCount: persistedState?.externalIpCount ?? 0,
  totalNotUniqueIpCount: persistedState?.totalNotUniqueIpCount ?? 0,
  subNetworkCount: persistedState?.subNetworkCount ?? 0,
  webResourceSelected: persistedState?.webResourceSelected ?? null,
  appEvent: persistedState?.appEvent ?? APP_EVENT_TYPE.NOTIFICATION,
  isInitialFetchDone: persistedState?.isInitialFetchDone,
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

  const currentValues = keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: store[key].get,
    }),
    {} as GlobalStore
  );

  useEffect(() => {
    localStorage.setItem('globalStore', JSON.stringify(currentValues));
  }, [JSON.stringify(currentValues)]);

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
