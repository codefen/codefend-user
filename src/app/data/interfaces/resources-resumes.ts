import type { ID } from './util';

export interface WebResourceResume extends ID {
  resource_domain: string;
  server: string;
  childs: Omit<WebResourceResume, 'childs'>[];
}

export interface MobileResourceResume extends ID {
  app_name: string;
  app_link: string;
}

export interface CloudResourceResume extends ID {
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
export interface SourceResourceResume extends ID {
  name: string;
  access_link: string;
}

export interface LanResourceResume extends ID {
  device_ex_address: string;
  device_in_address: string;
  childs: Omit<LanResourceResume, 'childs'>[];
}
