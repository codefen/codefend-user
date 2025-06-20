import { useNavigate } from 'react-router';
import type { ColumnTableV3 } from '@interfaces/table.ts';
import { APP_EVENT_TYPE, type Webresource } from '@interfaces/panel.ts';
import {
  TrashIcon,
  BugIcon,
  DocumentIcon,
  CredentialIcon,
  PlusIcon,
  CubeIcon,
  CodefendIcon,
} from '@icons';
import { useUserRole } from '#commonUserHooks/useUserRole';
import useCredentialStore from '@stores/credential.store.ts';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import TextChild from '@/app/views/components/utils/TextChild';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { useAutoScan } from '@moduleHooks/neuroscan/useAutoScan';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useOrderStore } from '@stores/orders.store';
import { apiErrorValidation } from '@/app/constants/validations';
import { OrderSection, ResourcesTypes } from '@interfaces/order';

interface WebResourcesProps {
  webResources: Webresource[];
  isLoading: boolean;
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

export const WebApplicationResources = ({ isLoading, webResources }: WebResourcesProps) => {
  const navigate = useNavigate();
  const { isAdmin, isProvider } = useUserRole();
  const userHaveAccess = isAdmin() || isProvider();
  const { resourceType, openModal, resourceID, webResourceSelected, appEvent } =
    useGlobalFastFields([
      'resourceType',
      'openModal',
      'resourceID',
      'webResourceSelected',
      'company',
      'appEvent',
    ]);
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { autoScan } = useAutoScan();
  const { updateState } = useOrderStore();

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
    webResourceSelected.set(row);
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
      label: 'AI Scans',
      icon: (
        <img
          src="codefend/pentest-header-vector.svg"
          alt="Normal Order Icon"
          style={{ width: '1.3em', height: '1.3em' }}
        />
      ),
      onClick: (row: any) => {
        autoScan(row.resource_domain, true, '').then(result => {
          if (apiErrorValidation(result)) {
            updateState('open', true);
            updateState('orderStepActive', OrderSection.PAYWALL_MAX_SCAN);
            updateState('resourceType', ResourcesTypes.WEB);
            appEvent.set(APP_EVENT_TYPE.LIMIT_REACHED_NEUROSCAN);
            return;
          }
          if (result?.neuroscan?.id) {
            toast.success(APP_MESSAGE_TOAST.START_SCAN);
            setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
            setIsOpen(true);
          }
        });
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
        webResourceSelected.set(row);
        createIssue(row.id);
      },
    },
    {
      label: 'Add subdomain',
      icon: <PlusIcon />,
      disabled: (row: any) => !!row?.resource_domain_dad,
      onClick: (row: any) => {
        webResourceSelected.set(row);
        setIsOpen(true);
        setModalId(MODAL_KEY_OPEN.ADD_SUB_DOMAIN);
      },
    },
    {
      label: 'Credentials',
      icon: <CredentialIcon width="1.3rem" height="1.3rem" />,
      onClick: (row: any) => {
        addCreds(row.id);
      },
    },
  ];

  return (
    <div className="web-section">
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
