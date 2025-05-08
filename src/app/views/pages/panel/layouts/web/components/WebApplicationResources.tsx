import { useState, type FC, useRef, useEffect } from 'react';
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
import { useAutoScan } from '@panelHooks/useAutoScan';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';

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
    weight: '6%',
    render: (ID: any) => ID,
  },
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-web-2 ',
    weight: '40%',
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
    weight: '17%',
    render: (ip: any) => ip,
  },
  {
    header: 'area',
    key: 'server_pais',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-web-4',
    weight: '16%',
    render: (row: any) => (
      <LocationItem country={row?.server_pais || ''} countryCode={row?.server_pais_code || ''} />
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
  const [term, setTerm] = useState('');
  // const [contextMenu, setContextMenu] = useState<{
  //   visible: boolean;
  //   x: number;
  //   y: number;
  //   row: any | null;
  // }>({ visible: false, x: 0, y: 0, row: null });
  // const contextMenuRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClick = (event: MouseEvent) => {
  //     if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
  //       setContextMenu({ ...contextMenu, visible: false });
  //     }
  //   };
  //   if (contextMenu.visible) {
  //     document.addEventListener('mousedown', handleClick);
  //   }
  //   return () => {
  //     document.removeEventListener('mousedown', handleClick);
  //   };
  // }, [contextMenu]);

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

  // const webColumnsWith = [
  //   ...webColumns,
  //   {
  //     header: '',
  //     key: TABLE_KEYS.ACTION,
  //     type: TABLE_KEYS.FULL_ROW,
  //     styles: 'item-cell-web-5',
  //     weight: '18.5%',
  //     render: (row: any) => (
  //       <div
  //         className="publish"
  //         key={`actr-${row.id}`}
  //         onContextMenu={e => {
  //           e.preventDefault();
  //           setContextMenu({ visible: true, x: e.clientX, y: e.clientY, row });
  //         }}>
  //         <span
  //           className={`issue-icon flex-box ${userHaveAccess ? '' : 'disable'}`}
  //           title={`${isNormalUser() ? '' : 'Add Issue'}`}
  //           onClick={() => createIssue(row.id)}>
  //           <BugIcon isButton key={`bugi-${row.id}`} />
  //           <span className="codefend-text-red-200 issue-count">{row.final_issues}</span>
  //         </span>
  //       </div>
  //     ),
  //   },
  // ];

  const contextMenuActions = [
    {
      label: 'View report',
      icon: <DocumentIcon isButton width={1.27} height={1.27} />,
      onClick: (row: any) => {
        generateWebReport(row.id, row.final_issues);
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

      <div className="search-bar-container">
        <ModalInput
          icon={<MagnifyingGlassIcon />}
          setValue={(val: string) => setTerm(val)}
          placeholder="Search resource..."
        />
      </div>

      <div className="card">
        <div className="over">
          <Tablev3
            className="table-web"
            columns={webColumns}
            rows={webResources}
            showRows={!isLoading}
            initialOrder="resource_domain"
            isNeedSearchBar={false}
            limit={0}
            isNeedSort
            enableContextMenu
            contextMenuActions={contextMenuActions}
          />
        </div>
      </div>

      {/* {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          className="custom-context-menu"
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999 }}>
          <div
            className={`context-menu-item ${Number(contextMenu.row?.final_issues) === 0 ? 'off' : ''}`}
            onClick={() => {
              generateWebReport(contextMenu.row.id, contextMenu.row.final_issues);
              setContextMenu({ ...contextMenu, visible: false });
            }}>
            <DocumentIcon isButton width={1.27} height={1.27} /> Ver reporte
          </div>
          <Show when={isNormalUser() || isAdmin()}>
            <div
              className="context-menu-item"
              onClick={() => {
                deleteWebResource(contextMenu.row);
                setContextMenu({ ...contextMenu, visible: false });
              }}>
              <TrashIcon /> Eliminar
            </div>
          </Show>
          <div
            className="context-menu-item"
            onClick={() => {
              addCreds(contextMenu.row.id);
              setContextMenu({ ...contextMenu, visible: false });
            }}>
            <CredentialIcon /> Credenciales
          </div>
        </div>
      )}
      <style>{`
        .custom-context-menu {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          padding: 6px 0;
        }
        .context-menu-item {
          padding: 8px 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: #222;
          transition: background 0.2s;
        }
        .context-menu-item:hover {
          background: #f5f5f5;
        }
        .context-menu-item.off {
          color: #aaa;
          pointer-events: none;
        }
      `}</style> */}
    </div>
  );
};
