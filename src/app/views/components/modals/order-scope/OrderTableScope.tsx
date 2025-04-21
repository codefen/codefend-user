import type { FC } from 'react';
import { TableV2 } from '../..';
import { useGetScopeTables } from '@resourcesHooks/useGetScopeTables';
import { useCopyToClipboard } from '#commonHooks/useCopyToClipboard';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import type { ScopeAlias } from '@interfaces/util';
import { RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';

export interface OrderCloudScopeProps {
  title: string;
  resourceScope: any[];
  scopeALias: ScopeAlias;
}

const getLinkByScopeAlias = (resource: any, scopeAlias: ScopeAlias) => {
  switch (scopeAlias) {
    case RESOURCE_CLASS_ALIAS.MOBILE:
      return resource?.app_link || '';
    case RESOURCE_CLASS_ALIAS.SOURCE:
      return resource?.access_link || '';
    case RESOURCE_CLASS_ALIAS.WEB:
      return resource?.resource_domain || '';
    default:
      return '';
  }
};

export const OrderScopeTable: FC<OrderCloudScopeProps> = ({ title, scopeALias, resourceScope }) => {
  const getDataScopeResourceTable = useGetScopeTables();
  const [copyToClipboard] = useCopyToClipboard();
  const dataTable = getDataScopeResourceTable(scopeALias, resourceScope);

  const copyElement = (id: any) => {
    if (!id) return;
    let copiedEl = '';
    if (scopeALias === RESOURCE_CLASS_ALIAS.WEB) {
      const childResource = resourceScope
        .flatMap(resource => resource.childs)
        .find(child => child.id === id);
      copiedEl = childResource?.resource_domain || '';
    } else {
      const resource = resourceScope.find(resource => resource.id === id);
      copiedEl = getLinkByScopeAlias(resource, scopeALias);
    }
    if (copiedEl) {
      copyToClipboard(copiedEl);
      toast.success(APP_MESSAGE_TOAST.COPY_TEXT);
    }
  };

  return (
    <>
      <h2>{title}</h2>
      <TableV2
        columns={dataTable.columns}
        rowsData={dataTable.rows as any}
        showRows={true}
        showEmpty={!Boolean(dataTable.rows.length)}
        sizeY={15}
        selectItem={copyElement}
      />
    </>
  );
};
