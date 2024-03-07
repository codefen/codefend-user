import { create } from "zustand";
import { OrderEnvironment, OrderFrequency, OrderPaymentMethod, OrderSection, OrderTeamSize, ResourcesTypes, ScopeOptions } from "..";



interface OrderStore {
    orderStepActive: OrderSection;

    resourceType: ResourcesTypes;
    acceptCondition: boolean;
    scope: ScopeOptions;
    frequency: OrderFrequency;
    teamSize: OrderTeamSize;
    leadName: string;
    environmentOrder: OrderEnvironment;
    aditionalInfo: string;
    paymentMethod: OrderPaymentMethod;

    setScopeTotalResources: (resources: number)=> void;
    setScopeAllTotalResources: (resources: number)=> void;
    setScopeOption: (option: "all" | "type")=>void;
    updateState: (key: string, updated: any)=>void;
    resetActiveOrder: ()=>void;
}

export const useOrderStore = create<OrderStore>((set,_get)=>({
    orderStepActive: OrderSection.SCOPE,
    resourceType: ResourcesTypes.WEB,
    acceptCondition: false,
    scope: {totalAllResources: 0, totalResources: 0, scopeOption: "type"},
    frequency: OrderFrequency.ONE_ORDER,
    teamSize: OrderTeamSize.SMALL,
    leadName: "",
    environmentOrder: OrderEnvironment.TEST,
    aditionalInfo: "",
    paymentMethod: OrderPaymentMethod.BANK_TRANSFER,

    setScopeTotalResources: (resources: number)=>set((current: OrderStore)=>({...current, scope:{...current.scope, totalResources: resources }})),
    setScopeAllTotalResources: (resources: number)=>set((current: OrderStore)=>({...current, scope:{...current.scope, totalAllResources: resources }})),
    setScopeOption: (option: "all" | "type")=>set((current: OrderStore)=>({...current, scope:{...current.scope, scopeOption: option }})),

    updateState: (key: string, updated: any)=> set((current: OrderStore)=> ({...current, [key as keyof typeof current]: updated})),

    resetActiveOrder: ()=>set((state:OrderStore)=>({...state, orderStepActive: OrderSection.SCOPE}))
}));