import { useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { useDeleteWebResource } from '@resourcesHooks/web/useDeleteWebResources.ts';
import type { ColumnTableV3 } from '@interfaces/table.ts';
import type { Webresource } from '@interfaces/panel.ts';
import { useReportStore, type ReportStoreState } from '@stores/report.store.ts';
import useModal from '#commonHooks/useModal.ts';
import { LocationItem } from '@standalones/utils/LocationItem.tsx';
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
import Show from '@/app/components/Show/Show';
import useCredentialStore from '@stores/credential.store.ts';
import useModalStore from '@stores/modal.store.ts';
import { MODAL_KEY_OPEN, RESOURCE_CLASS, TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import TextChild from '@standalones/utils/TextChild';
import { useTableStoreV3 } from '@table/v3/tablev3.store';
import ModalTitleWrapper from '@/app/components/modalwrapper/ModalTitleWrapper.tsx';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';
import { toast } from 'react-toastify';

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
  const { showModal, setShowModal, showModalStr, setShowModalStr } = useModal();
  const { setCredentialType, setResourceId } = useCredentialStore();
  const { setIsOpen, setModalId } = useModalStore();
  const { handleDelete } = useDeleteWebResource();
  const { removeItem } = useTableStoreV3();
  const [fetcher] = useFetcher();

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
    setShowModal(true);
    setShowModalStr(MODAL_KEY_OPEN.DELETE_WEB);
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
    setShowModal(true);
    setShowModalStr(MODAL_KEY_OPEN.START_AUTO_SCAN);
  };

  const autoScan = () => {
    const companyID = getCompany();
    setShowModal(false);
    if (companyIdIsNull(companyID)) return;
    fetcher('post', {
      body: {
        model: 'modules/paranoid',
        resource_id: selectedResource.id,
        company_id: companyID,
      },
      requireSession: true,
    });
    toast.info('The scan has started. Please wait a few minutes, and you will see the results.');
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
          <span title="Scan domain" onClick={() => startAutoScan(row)}>
            <CodefendIcon key="scan-domain" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <>
      <ModalTitleWrapper
        isActive={showModal && showModalStr === MODAL_KEY_OPEN.START_AUTO_SCAN}
        close={() => setShowModal(false)}
        type="med-w"
        headerTitle="Confirm Scan">
        <ConfirmModal
          confirmText="Confirm"
          cancelText="Cancel"
          header="Estas seguro que quieres iniciar un analicis automatico?"
          action={autoScan}
          close={() => setShowModal(false)}
        />
      </ModalTitleWrapper>
      <AddDomainModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_DOMAIN}
        onDone={() => refresh()}
        close={() => setShowModal(false)}
      />
      <ModalTitleWrapper
        isActive={showModal && showModalStr === MODAL_KEY_OPEN.DELETE_WEB}
        close={() => setShowModal(false)}
        type="med-w"
        headerTitle="Delete web resource">
        <ConfirmModal
          header={`Are you sure to remove\n ${selectedResource.domain} - ${selectedResource.serverIp}`}
          cancelText="Cancel"
          confirmText="Delete"
          close={() => setShowModal(false)}
          action={() =>
            handleDelete(() => {
              refresh();
              removeItem(selectedResource.id);
            }, selectedResource.id).then(() => setShowModal(false))
          }
        />
      </ModalTitleWrapper>

      <AddSubDomainModal
        isOpen={showModal && showModalStr === MODAL_KEY_OPEN.ADD_SUB_DOMAIN}
        onDone={() => refresh()}
        close={() => setShowModal(false)}
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

                  setShowModal(true);
                  setShowModalStr(MODAL_KEY_OPEN.ADD_DOMAIN);
                }}>
                Add domain
              </div>
              <div
                onClick={() => {
                  if (isLoading) return;

                  setShowModal(true);
                  setShowModalStr(MODAL_KEY_OPEN.ADD_SUB_DOMAIN);
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
