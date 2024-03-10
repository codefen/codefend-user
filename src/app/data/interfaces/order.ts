export enum OrderSection {
    SCOPE=1,
    FREQUENCY=2,
    TEAM_SIZE=3,
    ORDER_REVIEW=4,
    SELECT_LEAD=5,
    ENVIRONMENT=6,
    ADDITIONAL_INFO=7,
    PAYMENT=8,
    WELCOME=9,
    PAYMENT_ERROR=10
}

export enum ResourcesTypes {
    WEB="web",
    MOBILE="mobile",
    CLOUD="cloud",
    CODE="source code",
    SOCIAL="social",
    NETWORK="network",
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

export enum ScopeOption {
    ALL,
    TYPE
}

export interface ScopeOptions {
    totalResources: number;
    totalAllResources: number;

    scopeOption: ScopeOption;
}

export enum OrderPaymentMethod {
    CRYPTO,
    CARD,
    BANK_TRANSFER,
    FINISHED
}
export enum OrderFrequency {
    ONE_ORDER,
    SUBSCRIPTION
}