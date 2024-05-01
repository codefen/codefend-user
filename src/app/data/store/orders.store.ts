import { create } from 'zustand';
import {
	OrderOffensive,
	type ResumeAllResources,
	OrderFrequency,
	OrderPaymentMethod,
	OrderSection,
	OrderTeamSize,
	ResourcesTypes,
	ScopeOption,
	type ScopeOptions,
} from '..';

export interface OrderStore {
	open: boolean;

	orderStepActive: OrderSection;

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

	referenceNumber: string;
	orderId: string;

	setScopeTotalResources: (resources: number) => void;
	setScopeAllTotalResources: (resources: number) => void;
	setScopeOption: (option: ScopeOption) => void;

	updateState: (key: string, updated: any) => void;
	resetActiveOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set, _get) => ({
	open: false,
	orderStepActive: OrderSection.SCOPE,
	resourceType: ResourcesTypes.WEB,
	acceptCondition: false,
	scope: {
		totalAllResources: 18,
		totalResources: 0,
		scopeOption: ScopeOption.UNKNOWN,
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

	updateState: (key: string, updated: any) =>
		set((current: OrderStore) => ({
			...current,
			[key as keyof typeof current]: updated,
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
            aditionalInfo: ""
		})),
}));
