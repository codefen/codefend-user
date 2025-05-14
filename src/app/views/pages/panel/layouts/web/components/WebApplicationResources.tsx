import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteWebResource } from '@resourcesHooks/web/useDeleteWebResources.ts';
import type { ColumnTableV3 } from '@interfaces/table.ts';
import type { Webresource } from '@interfaces/panel.ts';
import {
  TrashIcon,
  GlobeWebIcon,
  BugIcon,
  DocumentIcon,
  CredentialIcon,
  MagnifyingGlassIcon,
} from '@icons';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import AddSubDomainModal from '@modals/adding-modals/AddSubDomainModal.tsx';
import AddDomainModal from '@modals/adding-modals/AddDomainModal.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store.ts';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { useTableStoreV3 } from '@table/v3/tablev3.store';
import Show from '@/app/views/components/Show/Show';
import { ModalTitleWrapper } from '@modals/index';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import TextChild from '@/app/views/components/utils/TextChild';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';

interface WebResourcesProps {
  refresh: () => void;
  webResources: Webresource[];
  isLoading: boolean;
}

interface SelectedResource {
  id: string;
  domain: string;
  serverIp: string;
}

const webColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-web-1',
    weight: '10%',
    render: (ID: any) => ID,
  },
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-web-2 ',
    weight: '38%',
    render: (row: any, next?: any) =>
      !row?.resource_domain_dad ? (
        row.resource_domain
      ) : (
        <TextChild
          subNetwork={row.resource_domain}
          isLast={!next || (next && !next.resource_domain_dad)}
        />
      ),
  },
  {
    header: 'server ip',
    key: 'main_server',
    styles: 'item-cell-web-3',
    weight: '19%',
    render: (ip: any) => ip,
  },
  {
    header: 'area',
    key: 'server_pais',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-web-4',
    weight: '22%',
    render: (row: any) => (
      <LocationItem country={row?.server_pais || ''} countryCode={row?.server_pais_code || ''} />
    ),
  },
  {
    header: 'issues',
    key: 'final_issues',
    styles: 'item-cell-web-5',
    weight: '11%',
    render: (final_issues: any) => (
      <>
        <BugIcon />
        {final_issues || 0}
      </>
    ),
  },
];

export const WebApplicationResources: FC<WebResourcesProps> = ({
  isLoading,
  refresh,
  webResources,
}) => {
  const navigate = useNavigate();
  const { isAdmin, isProvider, isNormalUser } = useUserRole();
  const userHaveAccess = isAdmin() || isProvider();
  const [selectedResource, setSelectedResource] = useState<SelectedResource>({} as any);
  const { resourceType, openModal, resourceID } = useGlobalFastFields([
    'resourceType',
    'openModal',
    'resourceID',
  ]);
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const { handleDelete } = useDeleteWebResource();
  const { removeItem } = useTableStoreV3();

  const createIssue = (id: string) => {
    navigate(userHaveAccess ? `/issues/create/web/${id}` : '', {
      state: { redirect: '/web' },
    });
  };
  const generateWebReport = (id: string, final_issues: any) => {
    if (Number(final_issues) >= 1) {
      openModal.set(true);
      resourceID.set(id);
      resourceType.set(RESOURCE_CLASS.WEB);
    }
  };
  const deleteWebResource = (row: any) => {
    setSelectedResource({
      id: row.id,
      domain: row.resource_domain,
      serverIp: row.main_server,
    });
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.DELETE_WEB);
  };
  const addCreds = (id: string) => {
    setResourceId(id);
    setCredentialType(RESOURCE_CLASS.WEB);
    setIsOpen(true);
    setModalId(RESOURCE_CLASS.WEB);
  };

  const contextMenuActions = [
    {
      label: 'View report',
      disabled: (row: any) => Number(row?.final_issues) < 1,
      icon: <DocumentIcon isButton width={1.27} height={1.27} />,
      onClick: (row: any) => {
        generateWebReport(row?.id, row?.final_issues);
      },
    },
    {
      label: 'Credentials',
      icon: <CredentialIcon width="1.3rem" height="1.3rem" />,
      onClick: (row: any) => {
        addCreds(row.id);
      },
    },
    {
      label: 'Delete',
      disabled: isProvider(),
      icon: <TrashIcon />,
      onClick: (row: any) => {
        deleteWebResource(row);
      },
    },
    {
      label: 'Add issue',
      disabled: !userHaveAccess,
      icon: <BugIcon isButton />,
      onClick: (row: any) => {
        createIssue(row.id);
      },
    },
  ];

  return (
    <div className="web-section">
      <AddDomainModal
        isOpen={isOpen && modalId === MODAL_KEY_OPEN.ADD_DOMAIN}
        onDone={() => refresh()}
        close={() => setIsOpen(false)}
      />
      <ModalTitleWrapper
        isActive={isOpen && modalId === MODAL_KEY_OPEN.DELETE_WEB}
        close={() => setIsOpen(false)}
        type="med-w"
        headerTitle="Delete web resource">
        <ConfirmModal
          header={`Are you sure to remove\n ${selectedResource.domain} - ${selectedResource.serverIp}`}
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setIsOpen(false)}
          action={() =>
            handleDelete(() => {
              refresh();
              removeItem(selectedResource.id);
            }, selectedResource.id).then(() => setIsOpen(false))
          }
        />
      </ModalTitleWrapper>

      <AddSubDomainModal
        isOpen={isOpen && modalId === MODAL_KEY_OPEN.ADD_SUB_DOMAIN}
        onDone={() => refresh()}
        close={() => setIsOpen(false)}
        webResources={webResources}
      />
      <Tablev3
        className="table-web"
        columns={webColumns}
        rows={webResources}
        showRows={!isLoading}
        initialOrder="resource_domain"
        isNeedSearchBar={true}
        limit={0}
        isNeedSort
        enableContextMenu
        contextMenuActions={contextMenuActions}
      />
    </div>
  );
};
