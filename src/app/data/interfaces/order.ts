export enum OrderSection {
    SCOPE=1,
    FREQUENCY=2,
    TEAM_SIZE=3,
    ORDER_REVIEW=4,
    SELECT_LEAD=5,
    ENVIRONMENT=6,
    ADDITIONAL_INFO=7,
    PAYMENT_METHOD=8,
    WELCOME=9
}

export enum ResourcesTypes {
    WEB,
    MOBILE,
    CLOUD,
    CODE,
    SOCIAL,
    NETWORK,
}

export enum OrderEnvironment {
    TEST,
    PRODUCTION
}

export enum OrderTeamSize {
    SMALL,
    MID,
    FULL
}

export interface ScopeOptions {
    totalResources: number;
    totalAllResources: number;

    scopeOption: "all" | "type";
}

export enum OrderPaymentMethod {
    CRYPTO,
    CARD,
    BANK_TRANSFER
}
export enum OrderFrequency {
    ONE_ORDER,
    SUBSCRIPTION
}