import { RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';
import type { TableItem } from '@interfaces/table';
import { memberColumnWithIssue, memberColumnWithoutContact, roleMap } from '@mocks/defaultData';
import {
  cloudScopeColumns,
  mobileScopeColumns,
  networkScopeColumns,
  networkScopeWithIssueColumns,
  socialScopeColumns,
  sourceCodeScopeColumns,
  sourceCodeScopeWithIssueColumns,
  webScopeColumns,
  webScopeColumnsWithCount,
} from '@mocks/scopeColumns';

export const useGetScopeTables = (useInIssueReport?: boolean, useResumeSocial?: boolean) => {
  const getDataScopeResourceTable = (scopeALias: string, scope: any[]) => {
    let rows = [];
    if (scopeALias === RESOURCE_CLASS_ALIAS.WEB) {
      rows =
        scope.map((res: any) => ({
          ID: { value: res.id, style: '' },
          Identifier: { value: res.id, style: 'id' },
          domainName: {
            value: res.resource_domain,
            style: 'domain-name',
          },
          server: {
            value: res.server || res.main_server,
            style: 'server-ip',
          },
          issue: Boolean(useInIssueReport)
            ? {
                value: res.final_issues,
                style: 'id',
              }
            : undefined,
          childs: {
            value: (props: any) => (
              <>
                {res.childs
                  ? res.childs.map((resChild: any, i: number) => (
                      <a
                        key={`child-${i}-${resChild.id}`}
                        className={`item item-with-out-action ${useInIssueReport && Number(resChild.final_issues) <= 0 ? 'item-disabled' : ''} ${
                          props.selectedField === `child-${resChild.id}` ? 'left-marked' : ''
                        }`}
                        href=""
                        onClick={e =>
                          props.handleClick(
                            e,
                            `child-${resChild.id}`,
                            resChild.id,
                            !useInIssueReport ? undefined : resChild.final_issues
                          )
                        }>
                        <div className="id">
                          <div className="publish">{resChild.id}</div>
                        </div>
                        <div className="domain-name lined">
                          <div className="publish">
                            <span
                              className={`sub-domain-icon-v ${res.childs.length == i + 1 && 'sub-is-last'}`}></span>
                            <span className="sub-domain-icon-h"></span>
                            <span className="sub-resource-domain">{resChild.resource_domain}</span>
                          </div>
                        </div>
                        <div className="server-ip">
                          <div className="publish">{resChild.main_server}</div>
                        </div>
                        <Show when={Boolean(useInIssueReport)}>
                          <div className="id">
                            <div className="publish">{resChild.final_issues}</div>
                          </div>
                        </Show>
                      </a>
                    ))
                  : null}
              </>
            ),
            style: '',
          },
        })) || [];
      return {
        rows: rows as Record<string, TableItem>[],
        columns: Boolean(useInIssueReport) ? webScopeColumnsWithCount : webScopeColumns,
      };
    }
    if (scopeALias === RESOURCE_CLASS_ALIAS.MOBILE) {
      rows =
        scope.map((res: any) => ({
          ID: { value: res.id, style: '' },
          Identifier: { value: res.id, style: 'id' },
          name: {
            value: res.app_name,
            style: 'full-name',
          },
          link: { value: res.app_link, style: 'url' },
        })) || [];
      return { rows, columns: mobileScopeColumns };
    }
    if (scopeALias === RESOURCE_CLASS_ALIAS.CLOUD) {
      rows =
        scope.map((res: any) => ({
          ID: { value: '', style: '' },
          Identifier: { value: res.id, style: 'id' },
          name: {
            value: res.cloud_name,
            style: 'full-name',
          },
          provider: { value: res.cloud_provider, style: 'full-name' },
        })) || [];
      return { rows, columns: cloudScopeColumns };
    }
    if (scopeALias === RESOURCE_CLASS_ALIAS.SOCIAL && !useResumeSocial) {
      rows =
        scope.map((res: any, i: number) => ({
          ID: { value: '', style: '' },
          Identifier: { value: i + 1, style: 'id' },
          domain: {
            value: res.domain,
            style: 'domain-name',
          },
          quantity: { value: res.quantity, style: 'id' },
        })) || [];
      return {
        rows: rows as Record<string, TableItem>[],
        columns: socialScopeColumns,
      };
    }
    if (scopeALias === RESOURCE_CLASS_ALIAS.SOCIAL && useResumeSocial) {
      rows =
        scope.map((res: any, i: number) => ({
          ID: { value: res.id, style: 'id' },
          fullName: {
            value: `${res.member_fname} ${res.member_lname}`,
            style: 'full-name',
          },
          role: {
            value: roleMap[res.member_role as keyof typeof roleMap],
            style: 'role',
          },
          issue: Boolean(useInIssueReport)
            ? {
                value: res.final_issues,
                style: 'id',
              }
            : undefined,
        })) || [];
      return {
        rows: rows as Record<string, TableItem>[],
        columns: Boolean(useInIssueReport) ? memberColumnWithIssue : memberColumnWithoutContact,
      };
    }
    if (scopeALias === RESOURCE_CLASS_ALIAS.SOURCE) {
      rows =
        scope.map((res: any) => ({
          ID: { value: res.id, style: '' },
          Identifier: { value: res.id, style: 'id' },
          name: {
            value: res.name,
            style: 'full-name',
          },
          link: { value: res.access_link, style: 'url' },
          issue: Boolean(useInIssueReport)
            ? {
                value: res.final_issues,
                style: 'id',
              }
            : undefined,
        })) || [];
      return {
        rows: rows as Record<string, TableItem>[],
        columns: Boolean(useInIssueReport)
          ? sourceCodeScopeWithIssueColumns
          : sourceCodeScopeColumns,
      };
    }
    if (scopeALias === RESOURCE_CLASS_ALIAS.NETWORK) {
      rows =
        scope.map((res: any) => ({
          ID: { value: res.id, style: '' },
          Identifier: { value: res.id, style: 'id' },
          externalIp: {
            value: res.device_ex_address,
            style: 'server-ip',
          },
          internalIp: { value: res.device_in_address, style: 'server-ip' },
          issue: Boolean(useInIssueReport)
            ? {
                value: res.final_issues,
                style: 'id',
              }
            : undefined,
          childs: {
            value: (props: any) => (
              <>
                {res.childs
                  ? res.childs.map((resChild: any, i: number) => (
                      <a
                        key={`child-${i}-${resChild.id}`}
                        className={`item item-with-out-action ${useInIssueReport && Number(resChild?.final_issues || 0) <= 0 ? 'item-disabled' : ''} ${
                          props.selectedField === `child-${resChild.id}` ? 'left-marked' : ''
                        }`}
                        href=""
                        onClick={e =>
                          props.handleClick(
                            e,
                            `child-${resChild.id}`,
                            resChild.id,
                            !useInIssueReport ? undefined : resChild.final_issues
                          )
                        }>
                        <div className="id">
                          <div className="publish">{resChild.id}</div>
                        </div>
                        <div className="server-ip lined">
                          <div className="publish">
                            <span
                              className={`sub-domain-icon-v ${res.childs.length == i + 1 && 'sub-is-last'}`}></span>
                            <span className="sub-domain-icon-h"></span>
                            <span className="sub-resource-domain">
                              {resChild.device_ex_address}
                            </span>
                          </div>
                        </div>
                        <div className="server-ip">
                          <div className="publish">{resChild.device_in_address}</div>
                        </div>
                        <Show when={Boolean(useInIssueReport)}>
                          <div className="id">
                            <div className="publish">{resChild?.final_issues || 0}</div>
                          </div>
                        </Show>
                      </a>
                    ))
                  : null}
              </>
            ),
            style: '',
          },
        })) || [];
      return {
        rows: rows as Record<string, TableItem>[],
        columns: Boolean(useInIssueReport) ? networkScopeWithIssueColumns : networkScopeColumns,
      };
    }
    return { rows: [] as Record<string, TableItem>[], columns: [] };
  };
  return getDataScopeResourceTable;
};
