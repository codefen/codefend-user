import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteWebResource } from '@resourcesHooks/web/useDeleteWebResources.ts';
import type { ColumnTableV3 } from '@interfaces/table.ts';
import type { Webresource } from '@interfaces/panel.ts';
import { useReportStore, type ReportStoreState } from '@stores/report.store.ts';
import {
  TrashIcon,
  GlobeWebIcon,
  BugIcon,
  DocumentIcon,
  CredentialIcon,
  CodefendIcon,
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
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import Show from '@/app/views/components/Show/Show';
import { ModalTitleWrapper } from '@modals/index';
import { useAutoScan } from '@hooks/useAutoScan';
import { LocationItem } from '@/app/views/components/utils/LocationItem';
import TextChild from '@/app/views/components/utils/TextChild';

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
    styles: 'item-cell-1',
    weight: '6%',
    render: (ID: any) => ID,
  },
  {
    header: 'domain',
    key: 'resource_domain',
    type: TABLE_KEYS.FULL_WITH_NEXT,
    styles: 'item-cell-2 item-domain-cell',
    weight: '45%',
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
    styles: 'item-cell-3',
    weight: '12%',
    render: (ip: any) => ip,
  },
  {
    header: 'area',
    key: 'server_pais',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-4',
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
  const { getCompany } = useUserData();
  const userHaveAccess = isAdmin() || isProvider();
  const [selectedResource, setSelectedResource] = useState<SelectedResource>({} as any);
  const { openModal, setResourceID, setResourceType } = useReportStore(
    (state: ReportStoreState) => state
  );
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId, isOpen, modalId } = useModalStore();
  const { handleDelete } = useDeleteWebResource();
  const { removeItem } = useTableStoreV3();
  const { autoScan } = useAutoScan();

  const createIssue = (id: string) => {
    navigate(userHaveAccess ? `/issues/create/web/${id}` : '', {
      state: { redirect: '/web' },
    });
  };
  const generateWebReport = (id: string, final_issues: any) => {
    if (Number(final_issues) >= 1) {
      openModal();
      setResourceID(id);
      setResourceType(RESOURCE_CLASS.WEB);
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

  const startAutoScan = (row: any) => {
    setSelectedResource({
      id: row.id,
      domain: row.resource_domain,
      serverIp: row.main_server,
    });
    setIsOpen(true);
    setModalId(MODAL_KEY_OPEN.START_AUTO_SCAN);
  };

  const punchToScan = async () => {
    const companyID = getCompany();
    setIsOpen(false);
    if (companyIdIsNull(companyID)) return;
    console.log('resource id in punchToScan: ', { selectedResource });
    autoScan(selectedResource.id).then(result => {
      setModalId(MODAL_KEY_OPEN.USER_WELCOME_FINISH);
      if (result?.error == 1) {
        setIsOpen(false);
      } else if (!!result) {
        setIsOpen(true);
      }
    });
  };

  const webColumnsWith = [
    ...webColumns,
    {
      header: '',
      key: TABLE_KEYS.ACTION,
      type: TABLE_KEYS.FULL_ROW,
      styles: 'item-cell-5 action',
      weight: '18.5%',
      render: (row: any) => (
        <div className="publish" key={`actr-${row.id}`}>
          <span
            className={`issue-icon ${userHaveAccess ? '' : 'disable'}`}
            title={`${isNormalUser() ? '' : 'Add Issue'}`}
            onClick={() => createIssue(row.id)}>
            <BugIcon isButton key={`bugi-${row.id}`} />
            <span className="codefend-text-red-200 issue-count">{row.final_issues}</span>
          </span>
          <span
            title="View report"
            className={`issue-printer ${Number(row.final_issues) == 0 ? 'off' : ''}`}
            onClick={() => generateWebReport(row.id, row.final_issues)}>
            <DocumentIcon isButton width={1.27} height={1.27} key={`doci-${row.id}`} />
          </span>
          <Show when={isNormalUser() || isAdmin()}>
            <span title="Delete" onClick={() => deleteWebResource(row)}>
              <TrashIcon />
            </span>
          </Show>

          <span title="Add credentials" onClick={() => addCreds(row.id)}>
            <CredentialIcon key={`credi-${row.id}`} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
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
      <div className="card">
        <div className="over">
          <div className="header">
            <div className="title">
              <div className="icon">
                <GlobeWebIcon />
              </div>
              <span>Domains and subdomains</span>
            </div>

            <div className="actions">
              <div
                onClick={() => {
                  if (isLoading) return;

                  setIsOpen(true);
                  setModalId(MODAL_KEY_OPEN.ADD_DOMAIN);
                }}>
                Add domain
              </div>
              <div
                onClick={() => {
                  if (isLoading) return;

                  setIsOpen(true);
                  setModalId(MODAL_KEY_OPEN.ADD_SUB_DOMAIN);
                }}>
                Add subdomain
              </div>
            </div>
          </div>

          <Tablev3
            className="table-web"
            columns={webColumnsWith}
            rows={webResources}
            showRows={!isLoading}
            initialOrder="resource_domain"
            isNeedSearchBar
            limit={0}
            isNeedSort
          />
        </div>
      </div>
    </>
  );
};
