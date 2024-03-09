import { create } from "zustand";
import { OrderEnvironment, OrderFrequency, OrderPaymentMethod, OrderSection, OrderTeamSize, ResourcesTypes, ScopeOption, ScopeOptions } from "..";



interface OrderStore {
    open: boolean;

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
    setScopeOption: (option: ScopeOption)=>void;
    
    updateState: (key: string, updated: any)=>void;
    resetActiveOrder: ()=>void;
}

export const useOrderStore = create<OrderStore>((set,_get)=>({
    open: false,
    orderStepActive: OrderSection.SCOPE,
    resourceType: ResourcesTypes.WEB,
    acceptCondition: false,
    scope: {totalAllResources: 0, totalResources: 0, scopeOption: ScopeOption.TYPE},
    frequency: OrderFrequency.ONE_ORDER,
    teamSize: OrderTeamSize.SMALL,
    leadName: "",
    environmentOrder: OrderEnvironment.TEST,
    aditionalInfo: "",
    paymentMethod: OrderPaymentMethod.BANK_TRANSFER,

    setScopeTotalResources: (resources: number)=>set((current: OrderStore)=>({...current, scope:{...current.scope, totalResources: resources }})),
    setScopeAllTotalResources: (resources: number)=>set((current: OrderStore)=>({...current, scope:{...current.scope, totalAllResources: resources }})),
    setScopeOption: (option: ScopeOption)=>set((current: OrderStore)=>({...current, scope:{...current.scope, scopeOption: option }})),

    updateState: (key: string, updated: any)=> set((current: OrderStore)=> ({...current, [key as keyof typeof current]: updated})),

    resetActiveOrder: ()=>set((state:OrderStore)=>({...state, orderStepActive: OrderSection.SCOPE, open: false}))
}));