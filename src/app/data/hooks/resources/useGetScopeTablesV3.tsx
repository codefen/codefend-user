import { RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';
import type { ColumnTableV3 } from '@interfaces/table';
import { roleMap } from '@mocks/defaultData';
import {
  cloudScopeColumnsV3,
  memberScopeColumnsWithIssueV3,
  memberScopeColumnsWithoutContactV3,
  mobileScopeColumnsV3,
  networkScopeColumnsV3,
  networkScopeWithIssueColumnsV3,
  socialScopeColumnsV3,
  sourceCodeScopeColumnsV3,
  sourceCodeScopeWithIssueColumnsV3,
  webScopeColumnsV3,
  webScopeColumnsWithCountV3,
} from '@mocks/scopeColumnsV3';

interface ScopeRow {
  id: string | number;
  identifier: string | number;
  [key: string]: any;
}

export const useGetScopeTablesV3 = (useInIssueReport?: boolean, useResumeSocial?: boolean) => {
  const getDataScopeResourceTable = (scopeALias: string, scope: any[]) => {
    let rows: ScopeRow[] = [];
    let columns: ColumnTableV3[] = [];

    if (scopeALias === RESOURCE_CLASS_ALIAS.WEB) {
      rows = scope.map((res: any) => ({
        id: res.id,
        identifier: res.id,
        domainName: res.resource_domain,
        resource_domain_dad: res?.resource_domain_dad,
        server: res?.main_server,
        ...(useInIssueReport && { issue: res.final_issues }),
        childs: res.childs?.map((resChild: any) => ({
          id: resChild.id,
          domainName: resChild.resource_domain,
          resource_domain_dad: resChild?.resource_domain_dad,
          server: resChild.main_server,
          ...(useInIssueReport && { issue: resChild.final_issues }),
        })),
      }));

      console.log('rows', rows);

      columns = useInIssueReport ? webScopeColumnsWithCountV3 : webScopeColumnsV3;
    }

    if (scopeALias === RESOURCE_CLASS_ALIAS.MOBILE) {
      rows = scope.map((res: any) => ({
        id: res.id,
        identifier: res.id,
        name: res.app_name,
        link: res.app_link,
      }));

      columns = mobileScopeColumnsV3;
    }

    if (scopeALias === RESOURCE_CLASS_ALIAS.CLOUD) {
      rows = scope.map((res: any) => ({
        id: res.id,
        identifier: res.id,
        name: res.cloud_name,
        provider: res.cloud_provider,
      }));

      columns = cloudScopeColumnsV3;
    }

    if (scopeALias === RESOURCE_CLASS_ALIAS.SOCIAL && !useResumeSocial) {
      rows = scope.map((res: any, i: number) => ({
        id: i + 1,
        identifier: i + 1,
        domain: res.domain,
        quantity: res.quantity,
      }));

      columns = socialScopeColumnsV3;
    }

    if (scopeALias === RESOURCE_CLASS_ALIAS.SOCIAL && useResumeSocial) {
      rows = scope.map((res: any) => ({
        id: res.id,
        identifier: res.id,
        fullName: `${res.member_fname} ${res.member_lname}`,
        role: roleMap[res.member_role as keyof typeof roleMap],
        ...(useInIssueReport && { issue: res.final_issues }),
      }));

      columns = useInIssueReport
        ? memberScopeColumnsWithIssueV3
        : memberScopeColumnsWithoutContactV3;
    }

    if (scopeALias === RESOURCE_CLASS_ALIAS.SOURCE) {
      rows = scope.map((res: any) => ({
        id: res.id,
        identifier: res.id,
        name: res.name,
        link: res.access_link,
        ...(useInIssueReport && { issue: res.final_issues }),
      }));

      columns = useInIssueReport ? sourceCodeScopeWithIssueColumnsV3 : sourceCodeScopeColumnsV3;
    }

    if (scopeALias === RESOURCE_CLASS_ALIAS.NETWORK) {
      rows = scope.map((res: any) => ({
        id: res.id,
        identifier: res.id,
        externalIp: res.device_ex_address,
        internalIp: res.device_in_address,
        ...(useInIssueReport && { issue: res.final_issues }),
        childs: res.childs?.map((resChild: any) => ({
          id: resChild.id,
          externalIp: resChild.device_ex_address,
          internalIp: resChild.device_in_address,
          ...(useInIssueReport && { issue: resChild.final_issues }),
        })),
      }));

      columns = useInIssueReport ? networkScopeWithIssueColumnsV3 : networkScopeColumnsV3;
    }

    return { rows, columns };
  };

  return getDataScopeResourceTable;
};
