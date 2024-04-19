export interface WebResourceResume {
    id: string;
    resource_domain: string;
    server: string;
    childs: Omit<WebResourceResume, "childs">[];
}

export interface MobileResourceResume {
    id: string;
    app_name: string;
    app_link: string;
}

export interface CloudResourceResume {
    id: string;
    cloud_name: string;
    cloud_provider: string;
}
export interface SocialDomain {
  domain: string;
  quantity: number;
}

export interface SocialResourceResume {
    social_resources: SocialDomain[];
}
export interface SourceResourceResume {
    id: string;
    name: string;
    access_link: string;
}

export interface LanResourceResume {
    id: string;
    device_ex_address: string;
    device_in_address: string;
    childs: Omit<LanResourceResume, "childs">[];
}