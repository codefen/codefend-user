import type { CloudResourceResume, LanResourceResume, MobileResourceResume, SocialResourceResume, SourceResourceResume, WebResourceResume } from "./resources-resumes";

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
    PAYMENT_ERROR=10,
    WELCOME=11,
    WAIT_CHECK=12,
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

export interface ResumeAllResources {
    web: WebResourceResume[];
    mobile: MobileResourceResume[];
    cloud: CloudResourceResume[];
    social: SocialResourceResume;
    source: SourceResourceResume[];
    lan: LanResourceResume[];
}

export interface FullOrder {
    id: string;
    company_id: string;
    user_id: string;
    user_email: string;
    user_username: string;
    resources_class: string;
    resources_ids: string;
    membership: string;
    membership_renewal: string;
    chosen_plan: string;
    chosen_plan_price: string;
    funds_full: string;
    funds_provider: string;
    funds_codefend: string;
    funds_reseller: string;
    provider_class: string;
    provider_id: string;

    offensiveness: string;
    provider_info: string;
    financial_resource: string;
    cc_blockchain: string;
    cc_from_address: string;
    cc_xfer_id: string;
    cc_value_received: string;
    card_name: string;
    card_number: string;
    card_exp: string;
    card_cvv: string;
    bank_xfer_id: string;
    condicion_financial: string;
    condicion_provider: string;
    condicion_finished: string;
    condicion_phase: string;
    condicion_review: string;
    fecha_financial_confirmacion: string;
    fecha_provider_confirmacion: string;
    fecha_cierre_calculada: string;
    fecha_cierre_real: string;
    reference_number: string;
    reseller_id: string;
    reseller_name: string;
    user_ua: string;
    user_ra: string;
    user_hci: string;
    user_hxff: string;
    user_pais: string;
    user_pais_code: string;
    user_pais_provincia: string;
    user_pais_ciudad: string;
    eliminado: string;
    creacion: string;
}
