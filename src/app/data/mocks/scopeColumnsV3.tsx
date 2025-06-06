import { TABLE_KEYS } from '@/app/constants/app-texts';
import TextChild from '@/app/views/components/utils/TextChild';
import type { ColumnTableV3 } from '@interfaces/table';

export const cloudScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '50%',
    render: data => data,
  },
  {
    header: 'Provider',
    key: 'provider',
    styles: 'item-cell-custom-3',
    weight: '30%',
    render: data => data,
  },
];

export const mobileScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '30%',
    render: data => data,
  },
  {
    header: 'Link',
    key: 'link',
    styles: 'item-cell-custom-3',
    weight: '50%',
    render: data => data,
  },
];

export const webScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'Domain Name',
    key: 'domainName',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-custom-2',
    weight: '50%',
    render: (row: any, next?: any) =>
      !row?.resource_domain_dad ? (
        row.domainName
      ) : (
        <TextChild
          subNetwork={row.domainName}
          isLast={!next || (next && !next.resource_domain_dad)}
        />
      ),
  },
  {
    header: 'Server',
    key: 'server',
    styles: 'item-cell-custom-3',
    weight: '30%',
    render: data => data,
  },
];

export const webScopeColumnsWithCountV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Domain Name',
    key: 'domainName',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-custom-2',
    weight: '45%',
    render: (row: any, next?: any) =>
      !row?.resource_domain_dad ? (
        row.domainName
      ) : (
        <TextChild
          subNetwork={row.domainName}
          isLast={!next || (next && !next.resource_domain_dad)}
        />
      ),
  },
  {
    header: 'Server',
    key: 'server',
    styles: 'item-cell-custom-3',
    weight: '30%',
    render: data => data,
  },
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-4',
    weight: '10%',
    render: data => data,
  },
];

export const socialScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'Domain',
    key: 'domain',
    styles: 'item-cell-custom-2',
    weight: '50%',
    render: data => data,
  },
  {
    header: 'Quantity',
    key: 'quantity',
    styles: 'item-cell-custom-3',
    weight: '30%',
    render: data => data,
  },
];

export const memberScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '10%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'domain',
    styles: 'item-cell-custom-2',
    weight: '25%',
    render: data => data,
  },
  {
    header: 'Email',
    key: 'quantity',
    styles: 'item-cell-custom-3',
    weight: '35%',
    render: data => data,
  },
  {
    header: 'Phone',
    key: 'phone',
    styles: 'item-cell-custom-4',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Role',
    key: 'role',
    styles: 'item-cell-custom-5',
    weight: '15%',
    render: data => data,
  },
];

export const memberScopeColumnsWithIssueV3: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '10%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'domain',
    styles: 'item-cell-custom-2',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'Email',
    key: 'quantity',
    styles: 'item-cell-custom-3',
    weight: '30%',
    render: data => data,
  },
  {
    header: 'Phone',
    key: 'phone',
    styles: 'item-cell-custom-4',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Role',
    key: 'role',
    styles: 'item-cell-custom-5',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-6',
    weight: '10%',
    render: data => data,
  },
];

export const memberScopeColumnsWithoutContactV3: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'domain',
    styles: 'item-cell-custom-2',
    weight: '45%',
    render: data => data,
  },
  {
    header: 'Role',
    key: 'role',
    styles: 'item-cell-custom-5',
    weight: '25%',
    render: data => data,
  },
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-6',
    weight: '15%',
    render: data => data,
  },
];

export const sourceCodeScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '35%',
    render: data => data,
  },
  {
    header: 'Link',
    key: 'link',
    styles: 'item-cell-custom-3',
    weight: '50%',
    render: data => data,
  },
];

export const sourceCodeScopeWithIssueColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '15%',
    render: data => data,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-custom-2',
    weight: '35%',
    render: data => data,
  },
  {
    header: 'Link',
    key: 'link',
    styles: 'item-cell-custom-3',
    weight: '40%',
    render: data => data,
  },
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-4',
    weight: '10%',
    render: data => data,
  },
];

export const networkScopeColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'External IP',
    key: 'externalIp',
    styles: 'item-cell-custom-2',
    weight: '40%',
    render: data => data,
  },
  {
    header: 'Internal IP',
    key: 'internalIp',
    styles: 'item-cell-custom-3',
    weight: '40%',
    render: data => data,
  },
];

export const networkScopeWithIssueColumnsV3: ColumnTableV3[] = [
  {
    header: 'Identifier',
    key: 'id',
    styles: 'item-cell-custom-1',
    weight: '20%',
    render: data => data,
  },
  {
    header: 'External IP',
    key: 'externalIp',
    styles: 'item-cell-custom-2',
    weight: '35%',
    render: data => data,
  },
  {
    header: 'Internal IP',
    key: 'internalIp',
    styles: 'item-cell-custom-3',
    weight: '35%',
    render: data => data,
  },
  {
    header: 'Issues',
    key: 'issue',
    styles: 'item-cell-custom-4',
    weight: '10%',
    render: data => data,
  },
];
