import type { ColumnTableV3 } from '@interfaces/table';

export const cloudScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Provider',
    key: 'provider',
    styles: 'item-cell-custom-3',
    weight: '1',
    render: data => data,
  },
];

export const mobileScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Link',
    key: 'link',
    styles: 'item-cell-custom-3',
    weight: '1',
    render: data => data,
  },
];

export const webScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Domain Name',
    key: 'domainName',
    styles: 'item-cell-custom-2',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Server',
    key: 'server',
    styles: 'item-cell-custom-3',
    weight: '1',
    render: data => data,
  },
];

export const webScopeColumnsWithCountV3: ColumnTableV3[] = [
  ...webScopeColumnsV3,
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-4',
    weight: '1',
    render: data => data,
  },
];

export const socialScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Domain',
    key: 'domain',
    styles: 'item-cell-custom-2',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Quantity',
    key: 'quantity',
    styles: 'item-cell-custom-3',
    weight: '1',
    render: data => data,
  },
];

export const sourceCodeScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Link',
    key: 'link',
    styles: 'item-cell-custom-3',
    weight: '1',
    render: data => data,
  },
];

export const sourceCodeScopeWithIssueColumnsV3: ColumnTableV3[] = [
  ...sourceCodeScopeColumnsV3,
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-4',
    weight: '1',
    render: data => data,
  },
];

export const networkScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '1',
    render: data => data,
  },
  {
    header: 'External IP',
    key: 'externalIp',
    styles: 'item-cell-custom-2',
    weight: '1',
    render: data => data,
  },
  {
    header: 'Internal IP',
    key: 'internalIp',
    styles: 'item-cell-custom-3',
    weight: '1',
    render: data => data,
  },
];

export const networkScopeWithIssueColumnsV3: ColumnTableV3[] = [
  ...networkScopeColumnsV3,
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-4',
    weight: '1',
    render: data => data,
  },
];
