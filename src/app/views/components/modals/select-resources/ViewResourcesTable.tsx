import { useEffect, useRef, useState, type FC } from 'react';
import { useGetScopeTables } from '@resourcesHooks/useGetScopeTables';
import { TableV2 } from '@table/tablev2';
import { useGetResources } from '@resourcesHooks/global/useGetResources';
import type { ScopeAlias } from '@interfaces/util';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, RESOURCE_CLASS_ALIAS } from '@/app/constants/app-texts';

export interface OrderCloudScopeProps {
  type: RESOURCE_CLASS;
  scopeALias: ScopeAlias;
  handleSelect: (id: string, type: RESOURCE_CLASS, count: number) => void;
  activeFilter: boolean;
  modalId: string;
}
const getPath = (alias: string): string => {
  if (alias == RESOURCE_CLASS_ALIAS.WEB) return 'web';
  if (alias == RESOURCE_CLASS_ALIAS.MOBILE) return 'mobile';
  if (alias == RESOURCE_CLASS_ALIAS.CLOUD) return 'cloud';
  if (alias == RESOURCE_CLASS_ALIAS.SOURCE) return 'source';
  if (alias == RESOURCE_CLASS_ALIAS.SOCIAL) return 'se';
  return 'lan';
};
export const ViewResourcesTable: FC<OrderCloudScopeProps> = ({
  type,
  scopeALias,
  handleSelect,
  activeFilter,
  modalId,
}) => {
  const { getAnyResource } = useGetResources();
  const getDataScopeResourceTable = useGetScopeTables(activeFilter, true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const dataTable = useRef<any>({
    columns: [{ ID: { value: '', style: '' } }],
    rows: [],
  });

  useEffect(() => {
    setLoading(true);

    getAnyResource(getPath(scopeALias))
      .then(resources => {
        let filterResult = resources;
        dataTable.current = getDataScopeResourceTable(scopeALias, filterResult);
      })
      .finally(() => setLoading(false));
    return () => {
      dataTable.current = {
        columns: [],
        rows: [],
      };
    };
  }, [scopeALias]);

  const title =
    modalId == MODAL_KEY_OPEN.SELECT_REPORT
      ? `Select your ${type} resource to generate report`
      : `Select your ${type} resource to create issue`;
  return (
    <>
      <h3>{title}</h3>
      <TableV2
        columns={dataTable.current.columns}
        rowsData={dataTable.current.rows}
        showRows={!isLoading}
        showEmpty={!isLoading && !Boolean(dataTable.current.rows.length)}
        sizeY={15}
        selectItem={(item: any) => {
          let id = item;
          if (activeFilter) id = item.ID;
          handleSelect(
            id,
            type.startsWith(RESOURCE_CLASS.SOURCE) ? RESOURCE_CLASS.SOURCE : type,
            Number(item.issueCount)
          );
        }}
      />
    </>
  );
};
