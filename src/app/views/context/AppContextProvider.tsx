import { useEffect, type PropsWithChildren } from 'react';
import createFastContext from './FastContextProvider';
import { ResourcesTypes } from '@interfaces/order';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';
import type { AuditData, LocationData, OwnerData } from '@interfaces/util';
import { EMPTY_COMPANY_CUSTOM } from '@/app/constants/empty';

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
};

const {
  FastContextProvider: GlobalStoreContextProvider,
  useFastField: useGlobalFastField,
  useFastContextFields: useGlobalFastFields,
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
