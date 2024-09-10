export const cloudScopeColumns = [
  { name: 'Identifier', value: 'id', style: 'id' },
  {
    name: 'name',
    value: 'name',
    style: 'full-name',
  },
  { name: 'provider', value: 'provider', style: 'full-name' },
];

export const mobileScopeColumns = [
  { name: 'Identifier', value: 'id', style: 'id' },
  {
    name: 'name',
    value: 'name',
    style: 'full-name',
  },
  { name: 'link', value: 'link', style: 'url' },
];

export const webScopeColumns = [
  { name: 'Identifier', value: 'id', style: 'id' },
  {
    name: 'domainName',
    value: 'domain',
    style: 'domain-name',
  },
  { name: 'server', value: 'server', style: 'server-ip' },
];

export const webScopeColumnsWithCount = [
  ...webScopeColumns,
  { name: 'issue', value: 'issues', style: 'id' },
];

export const socialScopeColumns = [
  { name: 'Identifier', value: 'id', style: 'id' },
  {
    name: 'domain',
    value: 'email domain',
    style: 'domain-name',
  },
  { name: 'quantity', value: 'quantity', style: 'id' },
];
export const sourceCodeScopeColumns = [
  { name: 'Identifier', value: 'id', style: 'id' },
  {
    name: 'name',
    value: 'name',
    style: 'full-name',
  },
  { name: 'link', value: 'url', style: 'url' },
];
export const sourceCodeScopeWithIssueColumns = sourceCodeScopeColumns.concat({
  name: 'issue',
  value: 'issues',
  style: 'id',
});

export const networkScopeColumns = [
  { name: 'Identifier', value: 'id', style: 'id' },
  {
    name: 'externalIp',
    value: 'external ip',
    style: 'server-ip',
  },
  {
    name: 'internalIp',
    value: 'internal ip',
    style: 'server-ip',
  },
];

export const networkScopeWithIssueColumns = networkScopeColumns.concat({
  name: 'issue',
  value: 'issues',
  style: 'id',
});
