export interface SearchOptions {
  _domain: string;
  email: string;
  username: string;
  password: string;
  name: string;
  hash: string;
  lastip: string;
  unknown: string;
}

export interface IntelData {
  name: string;
  value: Array<{
    [key: string]: string | undefined;
    hash?: string;
    regip?: string;
  }>;
}

export type LeakedType = 'crack' | 'geo';
