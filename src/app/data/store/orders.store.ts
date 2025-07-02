import type { ResumeAllResources, ScopeOptions } from '@interfaces/order';
import {
  OrderPaymentMethod,
  OrderSection,
  OrderOffensive,
  OrderTeamSize,
  ResourcesTypes,
  OrderFrequency,
  ScopeOption,
  UserPlanSelected,
  UserSmallPlanSelected,
} from '@interfaces/order';
import { create } from 'zustand';

export enum UserTrails {}

export interface OrderStore {
  open: boolean;

  orderStepActive: OrderSection;
  paywallSelected: UserPlanSelected;
  resourceType: ResourcesTypes;
  resumeResources: ResumeAllResources;

  acceptCondition: boolean;
  scope: ScopeOptions;
  frequency: OrderFrequency;
  teamSize: OrderTeamSize;
  providerId: string;
  offensiveOrder: OrderOffensive;
  aditionalInfo: string;
  paymentMethod: OrderPaymentMethod;
  userSmallPlanSelected: UserSmallPlanSelected;

  referenceNumber: string;
  orderId: string;

  setScopeTotalResources: (resources: number) => void;
  setScopeAllTotalResources: (resources: number) => void;
  setScopeOption: (option: ScopeOption) => void;

  updateState: <K extends keyof OrderStore>(key: K, updated: OrderStore[K]) => void;
  resetActiveOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set, _get) => ({
  open: false,
  orderStepActive: OrderSection.SCOPE,
  resourceType: ResourcesTypes.WEB,
  acceptCondition: false,
  scope: {
    totalAllResources: -1,
    totalResources: 0,
    scopeOption: ScopeOption.TYPE,
  },
  resumeResources: {} as any,
  frequency: OrderFrequency.UNKNOWN,
  teamSize: OrderTeamSize.UNKNOWN,
  providerId: '',
  offensiveOrder: OrderOffensive.UNKNOWN,
  aditionalInfo: '',
  paymentMethod: OrderPaymentMethod.UNKNOWN,
  referenceNumber: '',
  orderId: '',
  paywallSelected: UserPlanSelected.NOTHING,
  userSmallPlanSelected: UserSmallPlanSelected.NOTHING,

  setScopeTotalResources: (resources: number) =>
    set((current: OrderStore) => ({
      ...current,
      scope: { ...current.scope, totalResources: resources },
    })),
  setScopeAllTotalResources: (resources: number) =>
    set((current: OrderStore) => ({
      ...current,
      scope: { ...current.scope, totalAllResources: resources },
    })),
  setScopeOption: (option: ScopeOption) =>
    set((current: OrderStore) => ({
      ...current,
      scope: { ...current.scope, scopeOption: option },
    })),

  updateState: <K extends keyof OrderStore>(key: K, updated: OrderStore[K]) =>
    set(current => ({
      ...current,
      [key]: updated,
    })),

  resetActiveOrder: () =>
    set((state: OrderStore) => ({
      ...state,
      orderStepActive: OrderSection.SCOPE,
      open: false,
      scope: {
        ...state.scope,
        scopeOption: ScopeOption.UNKNOWN,
      },
      frequency: OrderFrequency.UNKNOWN,
      teamSize: OrderTeamSize.UNKNOWN,
      offensiveOrder: OrderOffensive.UNKNOWN,
      paymentMethod: OrderPaymentMethod.UNKNOWN,
      aditionalInfo: '',
      userSmallPlanSelected: UserSmallPlanSelected.NOTHING,
      paywallSelected: UserPlanSelected.NOTHING,
    })),
}));
