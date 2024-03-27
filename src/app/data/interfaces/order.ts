export enum OrderSection {
    SCOPE=1,
    FREQUENCY=2,
    TEAM_SIZE=3,
    ORDER_REVIEW=4,
    SELECT_LEAD=5,
    ENVIRONMENT=6,
    ADDITIONAL_INFO=7,
    PAYMENT=8,
    ANY_PAYMENT_METHOD=9,
    WELCOME=10,
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

export enum OrderOffensive {
    CAREFUL="careful",
    OFFENSIVE="offensive",
    ADVERSARY="adversary"
}

export enum OrderTeamSize {
    SMALL="small",
    MID="medium",
    FULL="full"
}

export enum ScopeOption {
    ALL,
    TYPE
}

export enum CryptoPayment {
    BITCOIN="BTC",
    ETHERIUM="ETH",
    LITECOIN="LTC",
    SOLANA="SOL",
    MONERO="XMR",
    USDT="USDT",
    USDC="USDC"

}

export interface ScopeOptions {
    totalResources: number;
    totalAllResources: number;

    scopeOption: ScopeOption;
}

export enum OrderPaymentMethod {
    CRYPTO="cc",
    CARD="card",
    BANK_TRANSFER="bank"
}
export enum OrderFrequency {
    ONCE="once",
    MEMBER_SHIP="membership"
}

export interface CompanyResourcesID {
    web: string[];
    mobile: string[];
    cloud: string[];
    social: string[];
    source: string[];
    lan: string[];
}