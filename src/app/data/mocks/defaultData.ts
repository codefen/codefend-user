import type { ColumnTable } from '@interfaces/table';

export const osTypes = ['windows', 'linux', 'android', 'ios', 'unknown'];

export const languageTypes = new Set([
  'js',
  'javascript',
  'ts',
  'typescript',
  'php',
  'python',
  'java',
  'rust',
  'html',
  'css',
  'ruby',
  'go',
  'golang',
  'c',
  'c++',
  'c#',
  '.net',
  'shell',
  'bash',
  'swift',
  'kotlin',
  'dart',
  'flutter',
  'astro',
  'perl',
  'scala',
  'r',
  'erlang',
  'Clojure',
  'f#',
  'react',
  'angular',
  'wordpress',
]);

export const defaultMobileCloudResourceAsset = new Set<string>([
  'main cloud',
  'mobile1',
  'mobile2',
  'mobile3',
  'mogile4',
  'mobile5',
  'nuevo',
  'nuevos cambios',
  'Albilad App',
  'secondary cloud',
  'Red Bus Córdoba',
]);

export const roleMap = {
  admin: 'administrative',
  human: 'human resources',
  info: 'information tech',
  ads: 'marketing',
  sales: 'sales',
  finance: 'finance',
  cs: 'customer service',
  prod: 'production & ops',
  plan: 'strategy & planning',
  law: 'law / legals',
};

export const companySizesList = [
  { label: '1 to 10 people', value: '1-10' },
  { label: '11 to 50 people', value: '11-50' },
  { label: '51 to 500 people', value: '51-500' },
  { label: 'More than 500 people', value: '>500' },
  { label: 'More than 1,000 people', value: '>1000' },
];

export const topVulnerabilitiesColumn: ColumnTable[] = [
  {
    name: 'issueTitle',
    value: 'issue title',
    style: 'vul-title',
  },
  {
    name: 'type',
    value: 'class',
    style: 'vul-class',
  },
  {
    name: 'author',
    value: 'author',
    style: 'username',
  },

  {
    name: 'score',
    value: 'risk level',
    style: 'vul-score',
  },

  {
    name: 'published',
    value: 'published',
    style: 'date',
  },
];

export const memberColumn: ColumnTable[] = [
  {
    name: 'ID',
    value: 'id',
    style: 'id',
  },
  {
    name: 'fullName',
    value: 'full name',
    style: 'full-name',
  },
  {
    name: 'email',
    value: 'email',
    style: 'email',
  },
  {
    name: 'phone',
    value: 'phone',
    style: 'phone',
  },
  {
    name: 'role',
    value: 'role',
    style: 'role',
  },
];
export const memberColumnWithoutContact: ColumnTable[] = memberColumn.filter(
  col => col.name !== 'phone' && col.name !== 'email'
);

export const memberColumnWithActions: ColumnTable[] = memberColumn.concat([
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
]);

export const memberColumnWithIssue: ColumnTable[] = memberColumn.concat([
  {
    name: 'issue',
    value: 'issues',
    style: 'id',
  },
]);

export const vulnerabilityRiskColumns: ColumnTable[] = [
  {
    name: 'risk',
    value: 'risk',
    style: 'risk',
  },
  {
    name: 'count',
    value: 'count',
    style: 'count',
  },
  {
    name: 'percent',
    value: 'percent',
    style: 'percent',
  },
];

export const cloudAndMobileColumns: ColumnTable[] = [
  {
    name: 'published',
    value: 'published',
    style: 'date',
  },
  {
    name: 'author',
    value: 'author',
    style: 'username',
  },
  {
    name: 'type',
    value: 'class',
    style: 'vul-class',
  },
  {
    name: 'risk',
    value: 'risk',
    style: 'vul-risk',
  },
  {
    name: 'score',
    value: 'score',
    style: 'vul-score',
  },
  {
    name: 'issueTitle',
    value: 'issue title',
    style: 'vul-title',
  },
];

export const sourceCodeColumns: ColumnTable[] = [
  {
    name: 'ID',
    value: 'id',
    style: 'id',
  },
  {
    name: 'name',
    value: 'name',
    style: 'full-name',
  },
  {
    name: 'url',
    value: 'address',
    style: 'url',
  },
  {
    name: 'visibility',
    value: 'visibility',
    style: 'boolean',
  },
  {
    name: 'sourceCode',
    value: 'source code',
    style: 'source-code',
  },
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
];

export const sourceCodeColumnsWithoutAction: ColumnTable[] = sourceCodeColumns.filter(
  column => column.name !== 'action'
);

export const issueColumns: ColumnTable[] = [
  {
    name: 'issueTitle',
    value: 'issue',
    style: 'vul-title',
  },
  {
    name: 'author',
    value: 'author',
    style: 'username',
  },
  /*{
		name: 'risk',
		value: 'risk',
		style: 'vul-risk',
	},*/
  {
    name: 'type',
    value: 'class',
    style: 'vul-class',
  },

  {
    name: 'score',
    value: 'risk level',
    style: 'vul-score',
  },
  {
    name: 'published',
    value: 'published',
    style: 'date',
  },
  {
    name: 'status',
    value: 'status',
    style: 'vul-condition',
  },
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
];
export const issuesColumnsWithoutAction: ColumnTable[] = issueColumns.filter(
  column => column.name !== 'action'
);
export const issuesColumnsWithoutActionAuthor: ColumnTable[] = issueColumns.filter(
  column => column.name !== 'action' && column.name !== 'author'
);

export const sourceCodeChartColumns = [
  {
    name: 'code',
    value: 'code',
    style: 'os',
  },
  {
    name: 'count',
    value: 'count',
    style: 'count',
  },
  {
    name: 'percent',
    value: 'percent',
    style: 'percent',
  },
];
export const osPercentCountColumns = [
  {
    name: 'os',
    value: 'os',
    style: 'os',
  },
  {
    name: 'count',
    value: 'count',
    style: 'count',
  },
  {
    name: 'percent',
    value: 'percent',
    style: 'percent',
  },
];

export const vdbColumns = [
  {
    name: 'Identifier',
    value: 'ID',
    style: 'id',
  },
  {
    name: 'published',
    value: 'published',
    style: 'id',
  },
  {
    name: 'cve',
    value: 'CVE',
    style: 'cve',
  },
  {
    name: 'title',
    value: 'title',
    style: 'vul-title',
  },
  {
    name: 'score',
    value: 'score',
    style: 'vul-score',
  },
  {
    name: 'risk',
    value: 'risk',
    style: 'vul-risk',
  },
];

export const supportTicket: ColumnTable[] = [
  { name: 'Identifier', value: 'ID', style: 'id' },
  {
    name: 'title',
    value: 'title',
    style: 'vul-title',
  },
  {
    name: 'author',
    value: 'author',
    style: 'username',
  },
  {
    name: 'status',
    value: 'status',
    style: 'status',
  },
  {
    name: 'published',
    value: 'published',
    style: 'date',
  },
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
];

export const defaultCompanyCardData = [
  {
    id: '1',
    name: 'Zamplify',
    website: 'order.zamlify.com',
    size: '50-99',
    country: 'Tokyo',
    city: 'Yakuzi',

    market: '',
    countryCode: '',
    province: '',
    address: '',

    ownerName: '',
    ownerLastname: '',
    ownerRole: '',
    ownerEmail: '',
    ownerPhone: '',
    orderSize: '',
    profileMedia: '',
    isDisabled: false,
    createdAt: '',
  },
  {
    name: 'Kodak',
    id: '2',
    website: 'kodak.tech',
    size: '10-19',
    country: 'Amsterdam',
    city: 'NY',

    market: '',
    countryCode: '',
    province: '',
    address: '',

    ownerName: '',
    ownerLastname: '',
    ownerRole: '',
    ownerEmail: '',
    ownerPhone: '',
    orderSize: '',
    profileMedia: '',
    isDisabled: false,
    createdAt: '',
  },
  {
    name: 'flash codefend',
    id: '3',
    website: 'flash.codefend.com',
    size: '20-49',
    country: 'Argentina',
    city: 'Bueno Aires',

    market: '',
    countryCode: '',
    province: '',
    address: '',

    ownerName: '',
    ownerLastname: '',
    ownerRole: '',
    ownerEmail: '',
    ownerPhone: '',
    orderSize: '',
    profileMedia: '',
    isDisabled: false,
    createdAt: '',
  },
];

export const locationTableColumn: ColumnTable[] = [
  {
    name: 'location',
    value: 'location',
    style: 'location',
  },
  {
    name: 'count',
    value: 'count',
    style: 'count',
  },
  {
    name: 'percent',
    value: 'percent',
    style: 'percent',
  },
];

export const defaultListLeadsColumns: ColumnTable[] = [
  {
    name: 'area',
    value: 'area',
    style: 'area',
  },
  {
    name: 'company',
    value: 'company',
    style: 'company',
  },
  {
    name: 'website',
    value: 'website',
    style: 'web-site',
  },
  {
    name: 'size',
    value: 'company size',
    style: 'size',
  },
  {
    name: 'fullname',
    value: 'full name',
    style: 'full-name',
  },
  {
    name: 'phone',
    value: 'phone',
    style: 'phone',
  },
  {
    name: 'postContact',
    value: 'contacted',
    style: 'post',
  },
];

export const resellerUserActiveColumns: ColumnTable[] = [
  {
    name: 'area',
    value: 'area',
    style: 'area',
  },
  {
    name: 'company',
    value: 'company',
    style: 'company',
  },
  {
    name: 'role',
    value: 'role',
    style: 'role',
  },
  {
    name: 'fullname',
    value: 'full name',
    style: 'full-name',
  },
  {
    name: 'phone',
    value: 'phone',
    style: 'phone',
  },
  {
    name: 'email',
    value: 'email',
    style: 'email',
  },

  {
    name: 'published',
    value: 'Sign up date',
    style: 'date',
  },
];

export const resellerCompanyColumns: ColumnTable[] = [
  {
    name: 'area',
    value: 'area',
    style: 'area',
  },
  {
    name: 'company',
    value: 'company',
    style: 'company',
  },
  {
    name: 'website',
    value: 'website',
    style: 'web-site',
  },
  {
    name: 'size',
    value: 'company size',
    style: 'size',
  },
  {
    name: 'fullname',
    value: 'full name',
    style: 'full-name',
  },
  {
    name: 'published',
    value: 'Creation date',
    style: 'date',
  },
];

export const resellerOrdersColumn: ColumnTable[] = [
  {
    name: 'Identifier',
    value: 'id',
    style: 'id',
  },
  {
    name: 'area',
    value: 'area',
    style: 'area',
  },

  {
    name: 'orderType',
    value: 'scope',
    style: 'type',
  },
  {
    name: 'plan',
    value: 'plan',
    style: 'plan',
  },
  {
    name: 'funds',
    value: 'price',
    style: 'funds',
  },
  {
    name: 'published',
    value: 'created',
    style: 'date',
  },
  {
    name: 'paid',
    value: 'paid',
    style: 'paid',
  },
  {
    name: 'finish',
    value: 'finished',
    style: 'finish',
  },
];

export const webResourcesWithoutActions = [
  {
    name: 'Identifier',
    value: 'id',
    style: 'id',
  },
  {
    name: 'domainName',
    value: 'domain',
    style: 'domain-name',
  },
  {
    name: 'mainServer',
    value: 'server ip',
    style: 'server-ip',
  },
  {
    name: 'location',
    value: 'location',
    style: 'location',
  },
];

export const lanResourcesTable = [
  {
    name: 'Identifier',
    value: 'id',
    style: 'id',
  },
  {
    name: 'externalIp',
    value: 'external IP',
    style: 'ip',
  },
  {
    name: 'internalIp',
    value: 'internal IP',
    style: 'ip',
  },

  {
    name: 'description',
    value: 'description',
    style: 'full-name',
  },
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
];

export const lanResourcesTableWithoutAction = lanResourcesTable.filter(
  column => column.name !== 'action'
);

export const companyOrdersColumns = [
  {
    name: 'orderClass',
    value: 'class',
    style: 'vul-class',
  },
  {
    name: 'offensiveness',
    value: 'offensiveness',
    style: 'vul-offensiveness',
  },
  {
    name: 'membership',
    value: 'membership',
    style: 'vul-member',
  },
  {
    name: 'plan',
    value: 'plan',
    style: 'vul-class',
  },
  {
    name: 'condition',
    value: 'condition',
    style: 'vul-offensiveness',
  },
  {
    name: 'planPrice',
    value: 'plan price',
    style: 'vul-class',
  },
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
];
export const companyMembersColumns = [
  {
    name: 'Identifier',
    value: 'id',
    style: 'id',
  },
  {
    name: 'fullName',
    value: 'full name',
    style: 'full-name',
  },
  {
    name: 'email',
    value: 'email',
    style: 'email',
  },
  {
    name: 'phone',
    value: 'phone',
    style: 'phone',
  },
  {
    name: 'role',
    value: 'role',
    style: 'role',
  },
];

export const preferenceMemberColumns = [
  {
    name: 'Identifier',
    value: 'id',
    style: 'id',
  },
  {
    name: 'area',
    value: 'area',
    style: 'area',
  },
  {
    name: 'company',
    value: 'company',
    style: 'company',
  },
  {
    name: 'fullName',
    value: 'full name',
    style: 'full-name',
  },
  {
    name: 'email',
    value: 'email',
    style: 'email',
  },
  {
    name: 'phone',
    value: 'phone',
    style: 'phone',
  },
  {
    name: 'role',
    value: 'role',
    style: 'role',
  },
  {
    name: 'action',
    value: 'action',
    style: 'id action',
  },
];

export const webResourcesColumns = webResourcesWithoutActions.concat([
  { name: 'action', value: 'actions', style: 'id action' },
]);

export const defaultCrypto = [
  {
    name: 'btc',
  },
  {
    name: 'eth',
  },
  {
    name: 'lite',
  },
  {
    name: 'xmr',
  },
  {
    name: 'solana',
  },
];

export const defaultSocialAttackVectors = {
  'email attacks': 'enabled',
  'telecom attacks': 'enabled',
  'social network attacks': 'disabled',
};

export const defaultPersonalDetails = [
  {
    title: 'email',
    value: '',
  },
  {
    title: 'firstname',
    value: '',
  },
  {
    title: 'lastname',
    value: '',
  },
  {
    title: 'phone',
    value: '',
  },
  {
    title: 'role',
    value: '',
  },
];

export const defaultOrderColumns = [
  {
    name: 'Identifier',
    value: 'id',
    style: 'id',
  },
  {
    name: 'size',
    value: 'size',
    style: 'size',
  },
  {
    name: 'offensivness',
    value: 'offensivness',
    style: 'offensivness',
  },
  {
    name: 'type',
    value: 'class',
    style: 'type',
  },
  {
    name: 'provider',
    value: 'provider',
    style: 'username',
  },
  {
    name: 'funds',
    value: 'funds',
    style: 'funds',
  },
  {
    name: 'state',
    value: 'state',
    style: 'state',
  },
  {
    name: 'publishedFinish',
    value: 'finish date',
    style: 'date',
  },
  {
    name: 'action',
    value: 'actions',
    style: 'id action',
  },
];
